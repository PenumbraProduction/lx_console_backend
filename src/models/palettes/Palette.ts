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
import { MapOverlapError } from "../../Errors/OverlapError";
import { PaletteItem } from "./PaletteItem";

export type PaletteData = { defaultName: string };

export interface PaletteManagerEmissions {
	itemAdd: (item: PaletteItem) => void;
	itemMove: (id1: number, id2: number) => void;
	itemDelete: (id: number | Set<number>) => void;
	itemUpdate: (item: PaletteItem) => void;
}

export class Palette<itemType extends PaletteItem> extends EventEmitter {
	private _untypedOn = this.on;
	private _untypedEmit = this.emit;
	public on = <K extends keyof PaletteManagerEmissions>(
		event: K,
		listener: PaletteManagerEmissions[K]
	): this => this._untypedOn(event, listener);
	public emit = <K extends keyof PaletteManagerEmissions>(
		event: K,
		...args: Parameters<PaletteManagerEmissions[K]>
	): boolean => this._untypedEmit(event, ...args);

	private _map: Map<number, itemType>;
	public defaultName: string;

	constructor(defaultName: string) {
		super();

		this.defaultName = defaultName;
		this._map = new Map<number, itemType>();
	}

	addItem(item: itemType): Palette<itemType> {
		if (this._map.has(item.id)) throw new MapOverlapError(`Palette Map entry '${item.id}' already exists`);
		this._map.set(item.id, item);
		this.itemUpdateListener(item);
		this.emit("itemAdd", item);
		return this;
	}

	private itemUpdateListener(item: itemType) {
		item.on("itemUpdate", (i) => this.emit("itemUpdate", i));
	}

	moveItem(id1: number, id2: number): Palette<itemType> {
		if (!this._map.has(id1)) throw new Error(`Cannot move item, source item ${id1} does not exist`);
		if (this._map.has(id2))
			throw new MapOverlapError(`Cannot move item, Palette Map entry '${id2}' already exists`);
		const g = this._map.get(id1);
		g._setId(id2);
		this._map.set(id2, g);
		this._map.delete(id1);
		this.emit("itemMove", id1, id2);
		return this;
	}

	removeItem(id: number): Palette<itemType> {
		this._map.delete(id);
		this.emit("itemDelete", id);
		return this;
	}

	removeItems(ids: Set<number>): Palette<itemType> {
		ids.forEach((id) => this._map.delete(id));
		this.emit("itemDelete", ids);
		return this;
	}

	getItem(id: number): itemType | undefined {
		return this._map.get(id);
	}

	getItems(ids: Set<number>): Map<number, itemType> {
		const temp = new Map();
		this._map.forEach((v, k) => (ids.has(k) ? temp.set(k, v) : void 0));
		return temp;
	}

	getAllItems(): Map<number, itemType> {
		return this._map;
	}

	getPaletteData(): PaletteData {
		return {defaultName: this.defaultName}
	}
}
