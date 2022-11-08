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
import { InvalidDMXError } from "../../Errors/InvalidDMXError";
import { DefinedProfile, DmxAddressRange, FixtureChannel, FixtureChannelType, FixtureChannelTypes, ProfileOptions } from "../../types";

export interface ChannelEmissions {
	addressUpdate: (address: number, type: FixtureChannelType, value: { val: number; programmerVal: number }, userInitiated: boolean) => void;
	nameUpdate: (name: string) => void;
}

export class Channel extends EventEmitter {
	private _untypedOn = this.on;
	private _untypedEmit = this.emit;
	public on = <K extends keyof ChannelEmissions>(event: K, listener: ChannelEmissions[K]): this => this._untypedOn(event, listener);
	public emit = <K extends keyof ChannelEmissions>(event: K, ...args: Parameters<ChannelEmissions[K]>): boolean => this._untypedEmit(event, ...args);

	id: number;
	name: string;
	profile: DefinedProfile;
	dmxAddressRange: DmxAddressRange;
	channelMap: FixtureChannel[]; // a list of the profiles channels with the channelMode applied
	output: Array<{ val: number; programmerVal: number }>;

	constructor(id: number, profile: DefinedProfile, dmxAddressStart: number) {
		super();

		this.id = id;
		this.name = profile.name;
		this.profile = profile;
		this.dmxAddressRange = {
			initial: dmxAddressStart,
			final: dmxAddressStart + profile.channelModes[profile.options.channelMode].count - 1
		};
		this.profile.channels.map((ch) => {
			if (!FixtureChannelTypes.includes(ch.type)) ch.type = "UNKNOWN";
			return ch;
		});
		this.channelMap = profile.channelModes[profile.options.channelMode].channels.map((chNo) => {
			const ch = this.profile.channels[chNo];
			ch.addressOffset = chNo;
			return ch;
		});
		this.output = [...Array(this.channelMap.length)].map((v) => (v = { val: 0, programmerVal: -1 }));
	}

	_setId(id: number): Channel {
		this.id = id;
		return this;
	}

	setName(name: string): Channel {
		this.name = name;
		this.emit("nameUpdate", name);
		return this;
	}

	setAddress(addressOffset: number, val: number, userInitiated: boolean) {
		if (!this.channelMap[addressOffset]) throw new InvalidDMXError(`Address Offset ${addressOffset} does not exist in channelMap in this mode`);
		if (userInitiated) this.output[addressOffset].programmerVal = val;
		else this.output[addressOffset].val = val;
		this.emit(`addressUpdate`, addressOffset, this.channelMap[addressOffset].type, this.output[addressOffset], userInitiated);
	}

	clearProgrammerValues() {
		this.output.forEach((v, i) => {
			v.programmerVal = -1;
			this.emit("addressUpdate", i, this.channelMap[i].type, v, false);
		});
	}

	clearProgrammerValue(channel: number) {
		this.output[channel].programmerVal = -1;
		this.emit("addressUpdate", channel, this.channelMap[channel].type, this.output[channel], false);
	}

	clearStandardValues() {
		this.output.forEach((v, i) => {
			v.val = 0;
			this.emit("addressUpdate", i, this.channelMap[i].type, v, false);
		});
	}

	clearStandardValue(channel: number) {
		this.output[channel].val = -1;
		this.emit("addressUpdate", channel, this.channelMap[channel].type, this.output[channel], false);
	}

	getChannelsMatchType(type: FixtureChannelType) {
		return this.channelMap.filter((ch) => ch.type == type);
	}

	getAddressFromType(type: FixtureChannelType) {
		return this.channelMap.findIndex((ch) => ch.type == type);
	}

	get masterAddress() {
		return this.channelMap.findIndex((ch) => ch.type == "INTENSITY");
	}

	static serialize(ch: Channel): ChannelData {
		return {
			channel: ch.id,
			dmxAddressRange: ch.dmxAddressRange,
			name: ch.name,
			profile: ch.profile,
			channelMap: ch.channelMap,
			output: ch.output
		};
	}

	saveSerialize(): ChannelSaveData {
		return {
			id: this.id,
			name: this.name,
			dmxAddressRange: this.dmxAddressRange,
			profile: this.profile
		};
	}

	static saveDeserialize(data: ChannelSaveData) {
		const ch = new Channel(data.id, data.profile, data.dmxAddressRange.initial);
		ch.setName(data.name);
		return ch;
	}
}
export type ChannelData = {
	channel: number;
	dmxAddressRange: DmxAddressRange;
	name: string;
	profile: DefinedProfile;
	channelMap: FixtureChannel[];
	output: {
		val: number;
		programmerVal: number;
	}[];
};

export type ChannelSaveData = {
	id: number,
	name: string;
	dmxAddressRange: DmxAddressRange;
	profile: DefinedProfile;
};
