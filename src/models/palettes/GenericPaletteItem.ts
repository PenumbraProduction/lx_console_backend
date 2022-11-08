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

import { ProfileTypeIdentifier } from "../../types";
import { PaletteData, PaletteItem } from ".";

export class GenericPaletteItem extends PaletteItem {
	addressValues: Map<ProfileTypeIdentifier, { addressOffset: number; value: number }>;

	constructor(paletteData: PaletteData, id: number, addressValues: Map<ProfileTypeIdentifier, { addressOffset: number; value: number }>) {
		super(paletteData, id);
		this.addressValues = addressValues;
	}

	static serialize(item: GenericPaletteItem): GenericPaletteItemData {
		if (!item) return null;
		return { id: item.id, name: item.name, addressValues: item.addressValues };
	}

	saveSerialize(): GenericPaletteItemSaveData {
		return { id: this.id, name: this.name, addressValues: this.addressValues };
	}

	saveDeserialize(data: GenericPaletteItemSaveData) {
		this.id = data.id;
		this.addressValues = data.addressValues;
		this.name = data.name;
	}
}

export type GenericPaletteItemData = { id: number; name: string; addressValues: Map<ProfileTypeIdentifier, { addressOffset: number; value: number }> };
export type GenericPaletteItemSaveData = { id: number; name: string; addressValues: Map<ProfileTypeIdentifier, { addressOffset: number; value: number }> };
