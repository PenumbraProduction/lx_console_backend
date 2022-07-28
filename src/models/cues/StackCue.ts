import { Transition } from "../Transition";

export class StackCue {
	referenceCueId: number;
	id: string;
	name: string;
	transition: Transition;

	constructor(id: string, name: string, referenceCueId: number, transition: Transition) {
		this.referenceCueId = referenceCueId;
		this.id = id;
		this.name = name;
		this.transition = transition;
	}
}

