import { ChannelAddress } from "../../types";
import { PaletteData, PaletteItem } from ".";

export class GenericPaletteItem extends PaletteItem {
	addressValues: Map<ChannelAddress, number>;

	constructor(paletteData: PaletteData, id: number, addressValues: Map<ChannelAddress, number>) {
		super(paletteData, id);
		this.addressValues = addressValues;
	}
}
