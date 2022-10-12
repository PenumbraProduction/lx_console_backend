import EventEmitter from "events";
import { ChannelAddress } from "../../types";
import { MapOverlapError } from "../../Errors/OverlapError";
import { StackCue } from "./StackCue";
import { TimingEvents, Transition, TransitionGroup } from "../Transition";
import { desk } from "../Desk";

export interface PlaybackEmissions {
	itemAdd: (item: StackCue) => void;
	itemMove: (id1: string, id2: string) => void;
	itemDelete: (id: string | Set<string>) => void;
	itemUpdate: (item: StackCue) => void;

	intensityUpdate: (intensity: number) => void;
	requestAddressUpdate: (channelAddress: ChannelAddress, value: number) => void;
	requestCueData: (channelAddress: ChannelAddress, value: number) => void;
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
	isRunning: boolean;

	constructor() {
		super();
		this.currentCue = -1;
		this.isRunning = false;
		this.cues = [];
	}

	get length(): number {
		return this.cues.length;
	}

	go() {
		if (this.isRunning) return this.transition.endNow();
		this.currentCue = (this.currentCue + 1) % this.cues.length;

		const transitions: Transition[] = [];

		const destinationData = this.cues[this.currentCue].getDestinationValues();
		const categoryTimings = this.cues[this.currentCue].cueTransitions;
		destinationData.forEach((val, { channel, address }) => {
			const ch = desk.patch.getChannel(channel);
			const timings = categoryTimings.get(ch.channelMap[address].type);
			const t = new Transition(ch.output[address].val, val, timings.duration, timings.delay);
			t.on(TimingEvents.UPDATE, (_t, tVal) => {
				console.log(`Setting ${channel} ${address}: ${tVal}`)
				ch.setAddress(address, tVal, false);
			}).on(TimingEvents.JUMPING, (_t, jumpStats) =>
				console.log(`t: Jumping: ${jumpStats.jumpFrames} frames, ${jumpStats.jumpValue} raw value, ${jumpStats.jumpTime}ms`)
			);
			transitions.push(t);
		});

		this.transition = new TransitionGroup(transitions, 0);

		this.transition.on(TimingEvents.END, () => {
			this.transition = null;
			this.isRunning = false;
		});

		this.transition.trigger();
		this.isRunning = true;
	}

	pause() {}

	// resume after pause
	resume() {}

	// stop the playback affecting channelAddresses, set back to 0
	stop() {}

	// setIntensity(intensity: number) {
	// todo: allow setting of overall intensity
	// 	this.intensity = intensity;
	// 	this.emit("intensityUpdate", intensity);
	// }

	addCue(cue: StackCue): Playback {
		if (this.cues.some((c) => c.id == cue.id)) throw new MapOverlapError(`Playback cue with ID '${cue.id}' already exists`);
		this.cues.push(cue);
		this.cues.sort((a, b) => parseFloat(a.id) - parseFloat(b.id));
		this.emit("itemAdd", cue);
		return this;
	}

	removeCue(id: string): Playback {
		this.cues = this.cues.filter((c) => c.id != id);
		this.emit("itemDelete", id);
		return this;
	}
}
