import { ProfileTypeIdentifier } from "../../types";
import { PaletteData, PaletteItem } from ".";

export class GenericPaletteItem extends PaletteItem {
	addressValues: Map<ProfileTypeIdentifier, number>;

	constructor(paletteData: PaletteData, id: number, addressValues: Map<ProfileTypeIdentifier, number>) {
		super(paletteData, id);
		this.addressValues = addressValues;
	}

	static serialize(item: GenericPaletteItem): GenericPaletteItemData {
		if (!item) return null;
		return { id: item.id, name: item.name, addressValues: item.addressValues };
	}
}

export type GenericPaletteItemData = { id: number, name: string, addressValues: Map<ProfileTypeIdentifier, number> };