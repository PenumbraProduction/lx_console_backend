/* 
 *  Copyright (C) 2022  Daniel Farquharson
 *  
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, version 3 (GPLv3)
 *  
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *  
 *  See https://github.com/LordFarquhar/lx_console_app/blob/main/LICENSE an 
 *  implementation of GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
 */

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