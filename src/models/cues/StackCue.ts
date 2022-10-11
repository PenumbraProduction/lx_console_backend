import { CuePaletteItem } from "../palettes";
import { Transition } from "../Transition";

export class StackCue {
	referenceCueId: number;
	id: string;
	name: string;
	// cueTransitions: Map<string, {cue: CuePaletteItem, transition: Transition}>;


	constructor(id: string, name: string, referenceCueId: number, cueTransitions: Map<string, {cue: CuePaletteItem, transition: Transition}>) {
		this.referenceCueId = referenceCueId;
		this.id = id;
		this.name = name;
		// this.cueTransitions = cueTransitions;
	}
}

