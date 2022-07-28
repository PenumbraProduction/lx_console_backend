import { StackCue } from "./StackCue";

export class CueGroup {
	cues: Map<string, StackCue>;
	id: string;
	name: string;

	constructor(id: string, name: string, cues: StackCue[] | Map<string, StackCue>) {
		this.id = id;
		this.name = name;
		this.cues = Array.isArray(cues) ? new Map(cues.map((c) => [c.id, c])) : cues;
	}
}
