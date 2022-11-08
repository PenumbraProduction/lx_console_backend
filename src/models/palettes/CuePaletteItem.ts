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

import { ChannelAddress } from "../../types";
import { PaletteData, PaletteItem } from ".";

export class CuePaletteItem extends PaletteItem {
	addressValues: Map<ChannelAddress, number>;
	// mimicPalettes: { category: string; id: number }[];

	constructor(
		paletteData: PaletteData,
		id: number,
		addressValues: Map<ChannelAddress, number>
		/* mimicPalettes: { category: string; id: number }[] */
	) {
		super(paletteData, id);
		this.addressValues = addressValues;
		// this.mimicPalettes = mimicPalettes;
	}

	static serialize(item: CuePaletteItem): CuePaletteItemData {
		if (!item) return null;
		return {
			id: item.id,
			name: item.name,
			addressValues: item.addressValues /*, mimicPalettes: item.mimicPalettes */
		};
	}

	saveSerialize(): CuePaletteItemSaveData {
		return {
			id: this.id,
			name: this.name,
			addressValues: this.addressValues
		};
	}

	saveDeserialize(data: CuePaletteItemSaveData): void {
		this.id = data.id;
		this.name = data.name;
		this.addressValues = data.addressValues;
	}
}

export type CuePaletteItemData = {
	id: number;
	name: string;
	addressValues: Map<ChannelAddress, number>;
	// mimicPalettes: { category: string; id: number }[];
};

export type CuePaletteItemSaveData = {
	id: number;
	name: string;
	addressValues: Map<ChannelAddress, number>;
	// mimicPalettes: { category: string; id: number }[];
};
