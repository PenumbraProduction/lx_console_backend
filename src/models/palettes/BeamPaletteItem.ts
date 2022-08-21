import { ChannelAddress } from "../..//types";
import { PaletteData, PaletteItem } from ".";

export class BeamPaletteItem extends PaletteItem {
    beamMap: Map<ChannelAddress, number>;

    constructor(paletteData: PaletteData, id: number, beamMap: Map<ChannelAddress, number>) {
        super(paletteData, id);
        this.beamMap = beamMap;
    }
}