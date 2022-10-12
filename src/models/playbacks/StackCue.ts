import { ChannelAddress } from "src/types";
import { CuePaletteItem } from "../palettes";
import { Transition } from "../Transition";

export class StackCue {
	source: number | Map<ChannelAddress, number>;
	id: string;
	name: string;
	cueTransitions: Map<string, {cue: CuePaletteItem, transition: Transition}>;


	constructor(id: string, name: string, source: number | Map<ChannelAddress, number>) {
		this.source = source;
		this.id = id;
		this.name = name;

		this.generateTransitionGroups()
	}

	private generateTransitionGroups() {
		
	}
}

