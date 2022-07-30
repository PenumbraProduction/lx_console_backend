import { MapOverlapError } from "../../Errors/OverlapError";
import { CueGroup } from "../cues/CueGroup";
import { StackCue } from "../cues/StackCue";

export const DEFAULT_PLAYBACK_NAME = "Playback #";

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

	_setId(id: number): Playback {
		if (this.name == DEFAULT_PLAYBACK_NAME.replace("#", this.id.toString()))
			this.name = DEFAULT_PLAYBACK_NAME.replace("#", id.toString());
		this.id = id;
		return this;
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
