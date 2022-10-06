import { PatchManager } from "./channels/PatchManager";
import { PlaybackManager } from "./playbacks/PlaybackManager";
import { BeamPaletteItem, ColourPaletteItem, CuePaletteItem, GroupPaletteItem, Palette, PositionPaletteItem, ShapePaletteItem } from "./palettes";

export class Desk {
	patch: PatchManager;
	groups: Palette<GroupPaletteItem>;
	cues: Palette<CuePaletteItem>;
	playbacks: PlaybackManager;
	colour: Palette<ColourPaletteItem>;
	beam: Palette<BeamPaletteItem>;
	shape: Palette<ShapePaletteItem>;
	position: Palette<PositionPaletteItem>;
	
	constructor() {
		this.patch = new PatchManager();
		
		this.colour = new Palette<ColourPaletteItem>("Colour #");
		this.beam = new Palette<BeamPaletteItem>("Beam #");
		this.shape = new Palette<ShapePaletteItem>("Shape #");
		this.position = new Palette<PositionPaletteItem>("Position #");

		this.groups = new Palette<GroupPaletteItem>("Group #");
		this.cues = new Palette<CuePaletteItem>("Cue #");

		this.playbacks = new PlaybackManager();
	}
}
