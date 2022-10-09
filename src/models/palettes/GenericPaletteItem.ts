import { ChannelAddress } from "../../types";
import { PaletteData, PaletteItem } from ".";

export class GenericPaletteItem extends PaletteItem {
	addressValues: Map<ChannelAddress, number>;

	constructor(paletteData: PaletteData, id: number, addressValues: Map<ChannelAddress, number>) {
		super(paletteData, id);
		this.addressValues = addressValues;
	}

	static serialize(item: GenericPaletteItem): GenericPaletteItemData {
		if (!item) return null;
		return { id: item.id, name: item.name, addressValues: item.addressValues };
	}
}

export type GenericPaletteItemData = { id: number, name: string, addressValues: Map<ChannelAddress, number> };