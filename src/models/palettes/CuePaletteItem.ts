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
}

export type CuePaletteItemData = {
	id: number;
	name: string;
	addressValues: Map<ChannelAddress, number>;
	// mimicPalettes: { category: string; id: number }[];
};
