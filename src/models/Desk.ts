import { PatchManager } from "./channels/PatchManager";
import { GroupManager } from "./groups/GroupManager";
import { CueManager } from "./cues/CueManager";
import { PlaybackManager } from "./playbacks/PlaybackManager";
import { Programmer } from "./Programmer";

export class Desk {
	programmer: Programmer;
	patch: PatchManager;
	groups: GroupManager;
	cues: CueManager;
	playbacks: PlaybackManager;

	constructor() {
		this.programmer = new Programmer();
		this.patch = new PatchManager();
		this.groups = new GroupManager();
		this.cues = new CueManager();
		this.playbacks = new PlaybackManager();
	}
}
