import { ChannelAddress } from "src/types";
import { desk } from "../Desk";

export class StackCue {
	source: StackCueSource;
	id: string;
	name: string;
	cueTransitions: CueTransitionData;

	constructor(id: string, name: string, source: StackCueSource) {
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

	static serialize(stackCue: StackCue): StackCueData {
		return { source: stackCue.source, id: stackCue.id, name: stackCue.name, cueTransitions: stackCue.cueTransitions };
	}
}

export type StackCueSourceType = "cue" | "raw";
export type StackCueSource = { type: StackCueSourceType; content: number | Map<ChannelAddress, number> };
export type CueTransitionData = Map<string, { delay: number; duration: number }>;
export type StackCueData = { source: StackCueSource, id: string, name: string, cueTransitions: CueTransitionData }
