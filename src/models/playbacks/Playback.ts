import { MapOverlapError } from "../../Errors/OverlapError";
import { CueGroup } from "./CueGroup";
import { StackCue } from "./StackCue";

export const DEFAULT_PLAYBACK_NAME = "Playback #";

export class Playback {
	// id: number;
	// name: string;
	cues: Map<string, CueGroup | StackCue>;

	constructor() {
		// this.id = id;
		// this.name = name;

		this.cues = new Map();
	}

	get length(): number {
		return this.cues.size;
	}

	addCue(cue: CueGroup | StackCue): Playback {
		if (this.cues.has(cue.id)) throw new MapOverlapError(`Playback Map entry '${cue.id}' already exists`);
		this.cues.set(cue.id, cue);
		return this;
	}
	
	removeCue(id: string): Playback {
		this.cues.delete(id);
		return this;
	}
}
