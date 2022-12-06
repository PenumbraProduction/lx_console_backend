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

import { EventEmitter } from "events";
import { Palette, PaletteData } from "./Palette";

export interface PaletteItemManagerEmissions {
	itemUpdate: (item: PaletteItem) => void;
}

export abstract class PaletteItem extends EventEmitter {
	private _untypedOn = this.on;
	private _untypedEmit = this.emit;
	public on = <K extends keyof PaletteItemManagerEmissions>(
		event: K,
		listener: PaletteItemManagerEmissions[K]
	): this => this._untypedOn(event, listener);
	public emit = <K extends keyof PaletteItemManagerEmissions>(
		event: K,
		...args: Parameters<PaletteItemManagerEmissions[K]>
	): boolean => this._untypedEmit(event, ...args);

	private parentData: PaletteData;
	public name: string;
	public id: number;

	constructor(parentData: PaletteData, id: number) {
        super();
		this.parentData = parentData;
		this.id = id;
		this.name = this.parentData.defaultName ? this.parentData.defaultName.replace("#", this.id.toString()) : this.id.toString();
	}

	_setId(id: number): PaletteItem {
		if (this.name == this.parentData.defaultName.replace("#", this.id.toString()))
			this.name = this.parentData.defaultName.replace("#", id.toString());
		this.id = id;
		return this;
	}

	setName(name: string): PaletteItem {
		this.name = name;
		this.emit("itemUpdate", this)
		return this;
	}

	abstract saveSerialize(): any;
	abstract saveDeserialize(data: any): void;
}

export interface PaletteItemSaveData {
	id: number;
	name: string;
}