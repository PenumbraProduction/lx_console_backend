import { PaletteData, PaletteItem } from ".";

export class ColourPaletteItem extends PaletteItem {
	addressValues: Map<{ channel: number; address: number }, number>;

	constructor(paletteData: PaletteData, id: number, addressValues: Map<{ channel: number; address: number }, number>) {
		super(paletteData, id);
		this.addressValues = addressValues;
	}
}
