/* 
 *  Copyright (C) 2022  Daniel Farquharson
 *  
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, version 3 (GPLv3)
 *  
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *  
 *  See https://github.com/LordFarquhar/lx_console_app/blob/main/LICENSE an 
 *  implementation of GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
 */

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

	static serialize(group: GroupPaletteItem): GroupData {
		return { id: group.id, channels: group.channels, name: group.name };
	}

	saveSerialize(): GroupPaletteItemSaveData {
		return { id: this.id, channels: this.channels, name: this.name };
	}
}

export type GroupData = { id: number, channels: Set<number>, name: string };
export type GroupPaletteItemSaveData = { id: number, channels: Set<number>, name: string };