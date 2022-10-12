import { PatchManager } from "./channels/PatchManager";
import { PlaybackManager } from "./playbacks/PlaybackManager";
import { CuePaletteItem, GenericPaletteItem, GroupPaletteItem, Palette } from "./palettes";
import { Playback } from "./playbacks";

export class Desk {
	patch: PatchManager;
	
	groups: Palette<GroupPaletteItem>;
	
	cues: Palette<CuePaletteItem>;
	// playbacks: PlaybackManager;
	playbacks: Playback;

	colour: Palette<GenericPaletteItem>;
	beam: Palette<GenericPaletteItem>;
	shape: Palette<GenericPaletteItem>;
	position: Palette<GenericPaletteItem>;
	function: Palette<GenericPaletteItem>;
	uncategorised: Palette<GenericPaletteItem>;
	
	constructor() {
		this.patch = new PatchManager();
		
		this.colour = new Palette<GenericPaletteItem>("Colour #");
		this.beam = new Palette<GenericPaletteItem>("Beam #");
		this.shape = new Palette<GenericPaletteItem>("Shape #");
		this.position = new Palette<GenericPaletteItem>("Position #");
		this.function = new Palette<GenericPaletteItem>("Function #");
		this.uncategorised = new Palette<GenericPaletteItem>("Uncategorised #");

		this.groups = new Palette<GroupPaletteItem>("Group #");
		this.cues = new Palette<CuePaletteItem>("Cue #");

		this.playbacks = new Playback();
	}
}

export const desk = new Desk();