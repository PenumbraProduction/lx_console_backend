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
import { ChannelAddress } from "../../types";
import { MapOverlapError } from "../../Errors/OverlapError";
import { StackCue, StackCueSaveData } from "./StackCue";
import { TimingEvents, Transition, TransitionGroup } from "../Transition";
import { desk } from "../Desk";

export interface PlaybackEmissions {
	itemAdd: (item: StackCue) => void;
	itemMove: (id1: string, id2: string) => void;
	itemDelete: (id: string | Set<string>) => void;
	itemUpdate: (item: StackCue) => void;

	intensityUpdate: (intensity: number) => void;
}

export class Playback extends EventEmitter {
	private _untypedOn = this.on;
	private _untypedEmit = this.emit;
	public on = <K extends keyof PlaybackEmissions>(event: K, listener: PlaybackEmissions[K]): this => this._untypedOn(event, listener);
	public emit = <K extends keyof PlaybackEmissions>(event: K, ...args: Parameters<PlaybackEmissions[K]>): boolean => this._untypedEmit(event, ...args);

	cues: StackCue[];
	transition: TransitionGroup;
	intensity: number;
	output: number[];
	currentCue: number;

	constructor() {
		super();
		this.currentCue = -1;
		this.cues = [];
	}

	get length(): number {
		return this.cues.length;
	}

	go() {
		if (this.transition) return this.transition.endNow();
		if (this.length < 1) return;
		this.currentCue = (this.currentCue + 1) % this.cues.length;

		const transitions: Transition[] = [];

		const destinationData = this.cues[this.currentCue].getDestinationValues();
		const categoryTimings = this.cues[this.currentCue].cueTransitions;
		destinationData.forEach((val, { channel, address }) => {
			const ch = desk.patch.getChannel(channel);
			const timings = categoryTimings.get(ch.channelMap[address].type);
			const t = new Transition(ch.output[address].val, val, timings.duration, timings.delay);
			t.on(TimingEvents.UPDATE, (_t, tVal) => {
				if (typeof tVal !== "number") return;
				ch.setAddress(address, tVal, false);
			}).on(TimingEvents.JUMPING, (_t, jumpStats) =>
				console.log(`t: Jumping: ${jumpStats.jumpFrames} frames, ${jumpStats.jumpValue} raw value, ${jumpStats.jumpTime}ms`)
			);
			transitions.push(t);
		});

		this.transition = new TransitionGroup(transitions, 0);

		this.transition.on(TimingEvents.END, () => {
			this.transition = null;
		});

		this.transition.trigger();
	}

	pause() {}

	// resume after pause
	resume() {}

	// stop the playback affecting channelAddresses, set back to 0
	stop() {
		if (this.transition) this.transition.endNow();
		desk.patch.getAllChannels().forEach((ch) => ch.clearStandardValues());
	}

	// setIntensity(intensity: number) {
	// todo: allow setting of overall intensity
	// 	this.intensity = intensity;
	// 	this.emit("intensityUpdate", intensity);
	// }

	addCue(cue: StackCue): Playback {
		if (this.cues.some((c) => c.id == cue.id)) throw new MapOverlapError(`Playback cue with ID '${cue.id}' already exists`);
		this.cues.push(cue);
		this.cues.sort((a, b) => parseFloat(a.id) - parseFloat(b.id));
		this.setupChannelListeners(cue);
		this.emit("itemAdd", cue);
		return this;
	}

	removeCue(id: string): Playback {
		this.cues = this.cues.filter((c) => c.id != id);
		this.cues[0]?.removeListener("update", this.itemUpdateListener);
		this.emit("itemDelete", id);
		return this;
	}

	private setupChannelListeners(sc: StackCue) {
		sc.on("update", this.itemUpdateListener);
	}

	private itemUpdateListener(item: StackCue) {
		console.log("Playback: itemUpdateListener fired");
		this.emit("itemUpdate", item);
	}

	saveSerialize(): PlaybackSaveData {
		return { cues: this.cues.map((c) => StackCue.saveSerialize(c)) };
	}

	saveDeserialize(data: PlaybackSaveData) {
		if(!data.cues || !data.cues.length) return;
		this.cues = data.cues.map((c) => StackCue.saveDeserialize(c));
		this.cues.forEach((c) => this.setupChannelListeners(c));
		this.currentCue = -1;
		this.output = [];
	}
}

export type PlaybackSaveData = {
	cues: StackCueSaveData[];
};
