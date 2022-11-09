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

		this.colour = new Palette<GenericPaletteItem, GenericPaletteItemSaveData>("Colour #", GenericPaletteItem);
		this.beam = new Palette<GenericPaletteItem, GenericPaletteItemSaveData>("Beam #", GenericPaletteItem);
		this.shape = new Palette<GenericPaletteItem, GenericPaletteItemSaveData>("Shape #", GenericPaletteItem);
		this.position = new Palette<GenericPaletteItem, GenericPaletteItemSaveData>("Position #", GenericPaletteItem);
		this.function = new Palette<GenericPaletteItem, GenericPaletteItemSaveData>("Function #", GenericPaletteItem);
		this.uncategorised = new Palette<GenericPaletteItem, GenericPaletteItemSaveData>("Uncategorised #", GenericPaletteItem);

		this.groups = new Palette<GroupPaletteItem, GroupPaletteItemSaveData>("Group #", GroupPaletteItem);
		this.cues = new Palette<CuePaletteItem, CuePaletteItemSaveData>("Cue #", CuePaletteItem);

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

	saveDeserialize(deskData: DeskSaveData) {
		if(deskData.patch) this.patch.saveDeserialize(deskData.patch);
		if(deskData.playbacks) this.playbacks.saveDeserialize(deskData.playbacks);
		if(deskData.cues) this.cues.saveDeserialize(deskData.cues);
		if(deskData.groups) this.groups.saveDeserialize(deskData.groups);
		if(deskData.colour) this.colour.saveDeserialize(deskData.colour);
		if(deskData.beam) this.beam.saveDeserialize(deskData.beam);
		if(deskData.shape) this.shape.saveDeserialize(deskData.shape);
		if(deskData.position) this.position.saveDeserialize(deskData.position);
		if(deskData.function) this.function.saveDeserialize(deskData.function);
		if(deskData.uncategorised) this.uncategorised.saveDeserialize(deskData.uncategorised);
	}
}

export type DeskSaveData = {
	patch?: PatchManagerSaveData;
	playbacks?: PlaybackSaveData;
	cues?: PaletteSaveData<CuePaletteItemSaveData>;
	groups?: PaletteSaveData<GroupPaletteItemSaveData>;
	colour?: PaletteSaveData<GenericPaletteItemSaveData>;
	beam?: PaletteSaveData<GenericPaletteItemSaveData>;
	shape?: PaletteSaveData<GenericPaletteItemSaveData>;
	position?: PaletteSaveData<GenericPaletteItemSaveData>;
	function?: PaletteSaveData<GenericPaletteItemSaveData>;
	uncategorised?: PaletteSaveData<GenericPaletteItemSaveData>;
};

export const desk = new Desk();
