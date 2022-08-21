import { ChannelAddress } from "../..//types";
import { PaletteData, PaletteItem } from ".";

export class ColourPaletteItem extends PaletteItem {
    colour: string;
    colourWheelMap: Map<ChannelAddress, number>;

    constructor(paletteData: PaletteData, id: number, colour: string, colourWheelMap: Map<ChannelAddress, number>) {
        super(paletteData, id);
        this.colour = colour;
        this.colourWheelMap = colourWheelMap;
    }
}