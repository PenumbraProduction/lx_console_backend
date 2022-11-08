/*
 *  Copyright (C) 2022  Daniel Farquharson
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, version 3 (GPLv3)
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  See https://github.com/LordFarquhar/lx_console_app/blob/main/LICENSE an
 *  implementation of GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
 */

import { EventEmitter } from "events";
import { DmxAddressRange, DefinedProfile, FixtureChannelType, ProfileOptions } from "../../types";
import { DmxRangeOverlapError, MapOverlapError } from "../../Errors/OverlapError";
import deepEqual from "deep-equal";

import { Channel } from "./Channel";

export interface PatchManagerEmissions {
	patchAdd: (channel: Channel) => void;
	patchMove: (id1: number, id2: number) => void;
	patchDelete: (id: number | Set<number>) => void;
	addressUpdate: (address: number, value: { val: number; programmerVal: number }, channel: Channel, type: FixtureChannelType, userInitiated: boolean) => void;
	channelNameUpdate: (id: number, name: string) => void;
}

export class PatchManager extends EventEmitter {
	private _untypedOn = this.on;
	private _untypedEmit = this.emit;
	public on = <K extends keyof PatchManagerEmissions>(event: K, listener: PatchManagerEmissions[K]): this => this._untypedOn(event, listener);
	public emit = <K extends keyof PatchManagerEmissions>(event: K, ...args: Parameters<PatchManagerEmissions[K]>): boolean =>
		this._untypedEmit(event, ...args);

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
			.map(([id, channel]) => this.checkDmxAddressOverlap(channel.dmxAddressRange, { initial: dmxAddressStart, final }))
			.some((elt) => elt);
		if (isOverlap) throw new DmxRangeOverlapError(`DMX Address Range ${dmxAddressStart} > ${final} overlaps with range of existing patch fixtures`);

		return null;
	}

	private checkDmxAddressOverlap(r1: DmxAddressRange, r2: DmxAddressRange): boolean {
		return (
			(r1.initial >= r2.initial && r1.initial <= r2.final) ||
			(r1.final >= r2.initial && r1.final <= r2.final) ||
			(r2.initial >= r1.initial && r2.initial <= r1.final) ||
			(r2.final >= r1.initial && r2.final <= r1.final)
		);
	}

	private setupChannelListeners(channel: Channel): Channel {
		channel.on("addressUpdate", (...args) => this.addressUpdateListener(channel, ...args));
		channel.on("nameUpdate", (...args) => this.nameUpdateListener(channel, ...args));
		return channel;
	}

	private addressUpdateListener(
		channel: Channel,
		address: number,
		type: FixtureChannelType,
		val: { val: number; programmerVal: number },
		userInitiated: boolean
	) {
		const offset = channel.dmxAddressRange.initial + address;
		this.emit("addressUpdate", offset, val, channel, type, userInitiated);
	}

	private nameUpdateListener(channel: Channel, name: string) {
		this.emit("channelNameUpdate", channel.id, name);
	}

	clearProgrammerValues() {
		this._map.forEach((ch) => {
			ch.clearProgrammerValues();
		});
	}

	addChannel(id: number, profile: DefinedProfile, dmxAddressStart: number): PatchManager {
		const isValid = this.isValid(id, profile, dmxAddressStart);
		if (isValid === null) {
			const channel = new Channel(id, profile, dmxAddressStart);
			this.setupChannelListeners(channel);
			this._map.set(id, channel);
		} else throw isValid;
		this.emit("patchAdd", this._map.get(id));
		return this;
	}

	moveChannel(id1: number, id2: number): PatchManager {
		if (!this._map.has(id1)) throw new Error(`Cannot move channel, source channel ${id1} does not exist`);
		if (this._map.has(id2)) throw new MapOverlapError(`Cannot move channel, PatchManager Map entry '${id2}' already exists`);
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

	getChannels(ids: Set<number> | Array<number>): Map<number, Channel> {
		const temp = new Map();
		ids.forEach((id) => (this._map.has(id) ? temp.set(id, this._map.get(id)) : undefined));
		// this._map.forEach((v, k) => (ids.has(k) ? temp.set(k, v) : void 0));
		return temp;
	}

	getChannelsByProfileType(profileId: string, profileOptions?: ProfileOptions): Map<number, Channel> {
		return Array.from(this._map.values())
			.filter((ch) => ch.profile.id == profileId && (profileOptions ? deepEqual(ch.profile.options, profileOptions) : true))
			.reduce((prev, ch) => prev.set(ch.id, ch), new Map<number, Channel>());
	}

	getAllChannelNumbers(): Array<number> {
		return Array.from(this._map.keys());
	}

	getUsedAddressSpace(): Array<number> {
		const used: Array<number> = [];
		this._map.forEach((ch) => {
			for (let i = ch.dmxAddressRange.initial; i <= ch.dmxAddressRange.final; i++) {
				used.push(i);
			}
		});
		return used;
	}

	getAllChannels(): Map<number, Channel> {
		return this._map;
	}

	saveSerialize() {
		const channels = Array.from(this._map).map(([n, ch]) => ch.saveSerialize());
		return { channels };
	}
}
