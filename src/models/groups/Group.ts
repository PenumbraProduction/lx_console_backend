import { GroupOptions } from "../../types";

const DEFAULT_GROUP_NAME = "Group #";

export class Group {
	// private options: GroupOptions;
	id: number;
	name: string;
	channels: Set<number>;

	constructor(options: GroupOptions) {
		// this.options = options; // ? I dont need to store the entire obj if im going to pick everything out

		this.id = options.id;
		this.name = options.name ? options.name : DEFAULT_GROUP_NAME.replace("#", this.id.toString());
		this.channels = options.channels ? options.channels : new Set();
	}

	_setId(id: number): Group {
		if (this.name == DEFAULT_GROUP_NAME.replace("#", this.id.toString()))
			this.name = DEFAULT_GROUP_NAME.replace("#", id.toString());
		this.id = id;
		return this;
	}

	setName(name: string): Group {
		this.name = name;
		return this;
	}

	setChannels(channels: Set<number>): Group {
		if (channels && channels.size) this.channels = channels;
		else this.channels.clear();
		return this;
	}

	addChannels(channels: Set<number> | Array<number>): Group {
		this.channels = new Set([...this.channels, ...channels]);
		return this;
	}

	removeChannels(channels: Set<number> | Array<number>): Group {
		channels.forEach((ch: number) => this.channels.delete(ch));
		return this;
	}
}
