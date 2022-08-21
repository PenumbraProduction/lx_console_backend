import { PaletteData, PaletteItem } from ".";

export class GroupPaletteItem extends PaletteItem {
	channels: Set<number>;

	constructor(paletteData: PaletteData, id: number, channels: Set<number>) {
		super(paletteData, id);
		this.channels = channels ? channels : new Set();
	}

	setChannels(channels: Set<number>): GroupPaletteItem {
		if (channels && channels.size) this.channels = channels;
		else this.channels.clear();
		return this;
	}

	addChannels(channels: Set<number> | Array<number>): GroupPaletteItem {
		this.channels = new Set([...this.channels, ...channels]);
		return this;
	}

	removeChannels(channels: Set<number> | Array<number>): GroupPaletteItem {
		channels.forEach((ch: number) => this.channels.delete(ch));
		return this;
	}
}
