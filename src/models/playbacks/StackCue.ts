import { ChannelAddress } from "src/types";
import { CuePaletteItem } from "../palettes";
import { Transition } from "../Transition";

export class StackCue {
	source: StackCueSource;
	id: string;
	name: string;
	cueTransitions: Map<string, { cue: CuePaletteItem; transition: Transition }>;

	constructor(id: string, name: string, source: StackCueSource) {
		this.source = source;
		this.id = id;
		this.name = name;

		this.generateTransitionGroups();
	}

	private generateTransitionGroups() {}
}

export type StackCueSourceType = "cue" | "raw";
export type StackCueSource = { type: StackCueSourceType; content: number | Map<ChannelAddress, number> };
