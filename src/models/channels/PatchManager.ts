import { EventEmitter } from "events";
import { DmxAddressRange, DefinedProfile } from "../../types";
import { DmxRangeOverlapError, MapOverlapError } from "../../Errors/OverlapError";

import { Channel } from "./Channel";

export class PatchManager extends EventEmitter {
	private _map: Map<number, Channel>;

	constructor() {
		super();

		this._map = new Map<number, Channel>();
	}

	private isValid(id: number, profile: DefinedProfile, dmxAddressStart: number): Error | null {
		if (id < 1 || id > 9999) return new RangeError(`id '${id}' out of valid range 1 -> 9999`);
		if (this._map.has(id)) return new MapOverlapError(`Patch already has a channel at index ${id}`);

		const final = dmxAddressStart + profile.channelModes[profile.options.channelMode].count - 1;

		const isOverlap = Array.from(this._map)
			.map(([id, channel]) =>
				this.checkDmxAddressOverlap(channel.dmxAddressRange, { initial: dmxAddressStart, final })
			)
			.some((elt) => elt);
		if (isOverlap)
			throw new DmxRangeOverlapError(
				`DMX Address Range ${dmxAddressStart} > ${final} overlaps with range of existing patch fixtures`
			);

		return null;
	}

	private checkDmxAddressOverlap(r1: DmxAddressRange, r2: DmxAddressRange) {
		return (
			(r1.initial >= r2.initial && r1.initial <= r2.final) ||
			(r1.final >= r2.initial && r1.final <= r2.final) ||
			(r2.initial >= r1.initial && r2.initial <= r1.final) ||
			(r2.final >= r1.initial && r2.final <= r1.final)
		);
	}

	addChannel(id: number, profile: DefinedProfile, dmxAddressStart: number): PatchManager {
		const isValid = this.isValid(id, profile, dmxAddressStart);
		if (isValid === null) {
			this._map.set(id, new Channel(id, profile, dmxAddressStart));
		} else throw isValid;
		this.emit("patchAdd", this._map.get(id));
		return this;
	}

	moveChannel(id1: number, id2: number): PatchManager {
		if (!this._map.has(id1)) throw new Error(`Cannot move channel, source channel ${id1} does not exist`);
		if (this._map.has(id2))
			throw new MapOverlapError(`Cannot move channel, PatchManager Map entry '${id2}' already exists`);
		const ch = this._map.get(id1);
		ch._setId(id2);
		this._map.set(id2, ch);
		this._map.delete(id1);
		this.emit("patchMove", id1, id2);
		return this;
	}

	removeChannel(id: number): PatchManager {
		this._map.delete(id);
		this.emit("patchDelete", id);
		return this;
	}

	removeChannels(ids: Set<number>): PatchManager {
		ids.forEach((id) => this._map.delete(id));
		this.emit("patchDelete", ids);
		return this;
	}

	getChannel(id: number): Channel | undefined {
		return this._map.get(id);
	}

	getChannels(ids: Set<number>): Map<number, Channel> {
		const temp = new Map();
		this._map.forEach((v, k) => (ids.has(k) ? temp.set(k, v) : void 0));
		return temp;
	}

	getAllChannels(): Map<number, Channel> {
		return this._map;
	}
}
