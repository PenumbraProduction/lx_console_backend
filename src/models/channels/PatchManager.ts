import { EventEmitter } from "events";
import { DmxAddressRange, DefinedProfile } from "../../types";
import { DmxRangeOverlapError, MapOverlapError } from "../../Errors/OverlapError";

import Channel from "./Channel";

export default class PatchManager extends EventEmitter {
	private _map: Map<number, Channel>;

	constructor() {
		super();

		this._map = new Map<number, Channel>();
	}

	private isValid(id: number, profile: DefinedProfile, dmxAddressStart: number): Error | null {
		if (id < 1 || id > 9999) return new RangeError(`id '${id}' out of valid range 1 -> 9999`);
		if (this._map.has(id)) return new MapOverlapError(`Patch already has a channel at index ${id}`);

        const final = dmxAddressStart + profile.channelModes[profile.options.channelMode].count - 1

		const isOverlap = Array.from(this._map)
			.map(([id, channel]) => this.checkDmxAddressOverlap(channel.dmxAddressRange, {initial: dmxAddressStart, final}))
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

	addChannel(id: number, profile: DefinedProfile, dmxAddressStart: number) {
		const isValid = this.isValid(id, profile, dmxAddressStart);
		if (isValid === null) {
			this._map.set(id, new Channel(id, profile, dmxAddressStart));
		} else throw isValid;
	}

	removeChannel(id: number) {
		this._map.delete(id);
	}

	getChannel(id: number): Channel | undefined {
		return this._map.get(id);
	}

	getAllChannels(): Map<number, Channel> {
		return this._map;
	}
}
