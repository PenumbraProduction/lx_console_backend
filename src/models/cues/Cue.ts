import { CueOptions, UniverseData } from "../../types";

export const DEFAULT_CUE_NAME = "Cue #";

export class Cue {
	id: number;
	name: string;
	channelData: UniverseData;

	constructor(options: CueOptions) {
		this.id = options.id;
		this.name = options.name ? options.name : DEFAULT_CUE_NAME.replace("#", this.id.toString());
		this.channelData = options.channelData;
	}

	_setId(id: number): Cue {
		if (this.name == DEFAULT_CUE_NAME.replace("#", this.id.toString()))
			this.name = DEFAULT_CUE_NAME.replace("#", id.toString());
        this.id = id;
        return this;
    }

	setName(name: string): Cue {
		this.name = name;
		return this;
	}
}
