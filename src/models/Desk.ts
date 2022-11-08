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

import { PatchManager, PatchManagerSaveData } from "./channels/PatchManager";
import {
	CuePaletteItem,
	CuePaletteItemSaveData,
	GenericPaletteItem,
	GenericPaletteItemSaveData,
	GroupPaletteItem,
	GroupPaletteItemSaveData,
	Palette,
	PaletteSaveData
} from "./palettes";
import { Playback, PlaybackSaveData } from "./playbacks";

export class Desk {
	patch: PatchManager;

	groups: Palette<GroupPaletteItem, GroupPaletteItemSaveData>;

	cues: Palette<CuePaletteItem, CuePaletteItemSaveData>;
	// playbacks: PlaybackManager;
	playbacks: Playback;

	colour: Palette<GenericPaletteItem, GenericPaletteItemSaveData>;
	beam: Palette<GenericPaletteItem, GenericPaletteItemSaveData>;
	shape: Palette<GenericPaletteItem, GenericPaletteItemSaveData>;
	position: Palette<GenericPaletteItem, GenericPaletteItemSaveData>;
	function: Palette<GenericPaletteItem, GenericPaletteItemSaveData>;
	uncategorised: Palette<GenericPaletteItem, GenericPaletteItemSaveData>;

	constructor() {
		this.patch = new PatchManager();

		this.colour = new Palette<GenericPaletteItem, GenericPaletteItemSaveData>("Colour #");
		this.beam = new Palette<GenericPaletteItem, GenericPaletteItemSaveData>("Beam #");
		this.shape = new Palette<GenericPaletteItem, GenericPaletteItemSaveData>("Shape #");
		this.position = new Palette<GenericPaletteItem, GenericPaletteItemSaveData>("Position #");
		this.function = new Palette<GenericPaletteItem, GenericPaletteItemSaveData>("Function #");
		this.uncategorised = new Palette<GenericPaletteItem, GenericPaletteItemSaveData>("Uncategorised #");

		this.groups = new Palette<GroupPaletteItem, GroupPaletteItemSaveData>("Group #");
		this.cues = new Palette<CuePaletteItem, CuePaletteItemSaveData>("Cue #");

		this.playbacks = new Playback();
	}

	saveSerialize(): DeskSaveData {
		return {
			patch: this.patch.saveSerialize(),
			playbacks: this.playbacks.saveSerialize(),
			cues: this.cues.saveSerialize(),
			groups: this.groups.saveSerialize(),
			colour: this.colour.saveSerialize(),
			beam: this.beam.saveSerialize(),
			shape: this.shape.saveSerialize(),
			position: this.position.saveSerialize(),
			function: this.function.saveSerialize(),
			uncategorised: this.uncategorised.saveSerialize()
		};
	}
}

export type DeskSaveData = {
	patch: PatchManagerSaveData;
	playbacks: PlaybackSaveData;
	cues: PaletteSaveData<CuePaletteItemSaveData>;
	groups: PaletteSaveData<GroupPaletteItemSaveData>;
	colour: PaletteSaveData<GenericPaletteItemSaveData>;
	beam: PaletteSaveData<GenericPaletteItemSaveData>;
	shape: PaletteSaveData<GenericPaletteItemSaveData>;
	position: PaletteSaveData<GenericPaletteItemSaveData>;
	function: PaletteSaveData<GenericPaletteItemSaveData>;
	uncategorised: PaletteSaveData<GenericPaletteItemSaveData>;
};

export const desk = new Desk();
