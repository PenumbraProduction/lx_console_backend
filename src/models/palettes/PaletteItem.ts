import { EventEmitter } from "node:events";
import { PaletteData } from "./Palette";

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
		this.name = this.parentData.defaultName.replace("#", this.id.toString());
	}

	_setId(id: number): PaletteItem {
		if (this.name == this.parentData.defaultName.replace("#", this.id.toString()))
			this.name = this.parentData.defaultName.replace("#", id.toString());
		this.id = id;
		return this;
	}

	setName(name: string): PaletteItem {
		this.name = name;
		return this;
	}
}
