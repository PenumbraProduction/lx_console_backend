import { ChannelAddress } from "src/types";
import { desk } from "../Desk";

export class StackCue {
	source: StackCueSource;
	id: string;
	name: string;
	cueTransitions: Map<string, { delay: number; duration: number }>;

	constructor(id: string, name: string, source: StackCueSource) {
		this.source = source;
		this.id = id;
		this.name = name;
	}

	setTransitionTimings(timings: Map<string, { delay: number; duration: number }>) {
		this.cueTransitions = timings;
	}

	getDestinationValues(): Map<ChannelAddress, number> {
		if (this.source.type == "raw") {
			return this.source.content as Map<ChannelAddress, number>
		} else {
			const cue = desk.cues.getItem(this.source.content as number)
			return cue.addressValues;
		}
	}
}

export type StackCueSourceType = "cue" | "raw";
export type StackCueSource = { type: StackCueSourceType; content: number | Map<ChannelAddress, number> };
