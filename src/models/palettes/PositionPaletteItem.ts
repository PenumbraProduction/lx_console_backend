import { ChannelAddress } from "../..//types";
import { PaletteData, PaletteItem } from ".";

export class PositionPaletteItem extends PaletteItem {
    positionMap: Map<ChannelAddress, number>;

    constructor(paletteData: PaletteData, id: number, positionMap: Map<ChannelAddress, number>) {
        super(paletteData, id);
        this.positionMap = positionMap;
    }
}