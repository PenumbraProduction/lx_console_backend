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

import EventEmitter from "events";
import { ChannelAddress } from "src/types";
import { desk } from "../Desk";

export interface StackCueEmissions {
	update: (item: StackCue) => void;
}

export class StackCue extends EventEmitter {
	private _untypedOn = this.on;
	private _untypedEmit = this.emit;
	public on = <K extends keyof StackCueEmissions>(event: K, listener: StackCueEmissions[K]): this => this._untypedOn(event, listener);
	public emit = <K extends keyof StackCueEmissions>(event: K, ...args: Parameters<StackCueEmissions[K]>): boolean => this._untypedEmit(event, ...args);
	
	source: StackCueSource;
	id: string;
	name: string;
	cueTransitions: CueTransitionData;

	constructor(id: string, name: string, source: StackCueSource) {
		super();

		this.source = source;
		this.id = id;
		this.name = name;
	}

	setTransitionTimings(timings: CueTransitionData) {
		this.cueTransitions = timings;
	}

	getDestinationValues(): Map<ChannelAddress, number> {
		if (this.source.type == "raw") {
			return this.source.content as Map<ChannelAddress, number>;
		} else {
			const cue = desk.cues.getItem(this.source.content as number);
			return cue.addressValues;
		}
	}

	setName(name: string) {
		this.name = name;
		this.emit("update", this);
		console.log("StackCue: Emitted update event")
	}

	static serialize(stackCue: StackCue): StackCueData {
		return { source: stackCue.source, id: stackCue.id, name: stackCue.name, cueTransitions: stackCue.cueTransitions };
	}
}

export type StackCueSourceType = "cue" | "raw";
export type StackCueSource = { type: StackCueSourceType; content: number | Map<ChannelAddress, number> };
export type CueTransitionData = Map<string, { delay: number; duration: number }>;
export type StackCueData = { source: StackCueSource, id: string, name: string, cueTransitions: CueTransitionData }
