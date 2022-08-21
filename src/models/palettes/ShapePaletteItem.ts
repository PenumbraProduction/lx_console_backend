import { ChannelAddress } from "../../types";
import { PaletteData, PaletteItem } from ".";

export class ShapePaletteItem extends PaletteItem {
    shapeMap: Map<ChannelAddress, number>;

    constructor(paletteData: PaletteData, id: number, colour: string, shapeMap: Map<ChannelAddress, number>) {
        super(paletteData, id);
        this.shapeMap = shapeMap;
    }
}