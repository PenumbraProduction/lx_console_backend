import { MapOverlapError } from "../../Errors/OverlapError";
import { CueGroup } from "../cues/CueGroup";
import { StackCue } from "../cues/StackCue";

export class Playback {
	id: number;
	name: string;
	length: number;
	cues: Map<string, CueGroup | StackCue>;

	constructor(id: number, name: string) {
		this.id = id;
		this.name = name;

		this.cues = new Map();
	}

	addCue(cue: CueGroup | StackCue): Playback {
		if(this.cues.has(cue.id)) throw new MapOverlapError(`Playback Map entry '${cue.id}' already exists`);
        this.cues.set(cue.id, cue);
        return this;
	}

	removeCue(id: string): Playback {
		this.cues.delete(id);
		return this;
	}
}
