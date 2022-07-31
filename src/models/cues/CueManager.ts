import { EventEmitter } from "events";
import { MapOverlapError } from "../../Errors/OverlapError";
import { Cue } from "./Cue";

export interface CueManagerEmissions {
	cueAdd: (cue: Cue) => void;
	cueMove: (id1: number, id2: number) => void;
	cueDelete: (id: number | Set<number>) => void;
}

export class CueManager extends EventEmitter {
	private _untypedOn = this.on;
	private _untypedEmit = this.emit;
	public on = <K extends keyof CueManagerEmissions>(event: K, listener: CueManagerEmissions[K]): this =>
		this._untypedOn(event, listener);
	public emit = <K extends keyof CueManagerEmissions>(
		event: K,
		...args: Parameters<CueManagerEmissions[K]>
	): boolean => this._untypedEmit(event, ...args);

	private _map: Map<number, Cue>;

	constructor() {
		super();

		this._map = new Map<number, Cue>();
	}

	addCue(cue: Cue): CueManager {
		if (this._map.has(cue.id)) throw new MapOverlapError(`CueManager Map entry '${cue.id}' already exists`);
		this._map.set(cue.id, cue);
		this.emit("cueAdd", cue);
		return this;
	}

	moveCue(id1: number, id2: number): CueManager {
		if (!this._map.has(id1)) throw new Error(`Cannot move cue, source cue ${id1} does not exist`);
		if (this._map.has(id2))
			throw new MapOverlapError(`Cannot move cue, CueManager Map entry '${id2}' already exists`);
		const g = this._map.get(id1);
		g._setId(id2);
		this._map.set(id2, g);
		this._map.delete(id1);
		this.emit("cueMove", id1, id2);
		return this;
	}

	removeCue(id: number): CueManager {
		this._map.delete(id);
		return this;
	}

	removeCues(ids: Set<number>): CueManager {
		ids.forEach((id) => this._map.delete(id));
		this.emit("cueDelete", ids);
		return this;
	}

	getCue(id: number): Cue | undefined {
		return this._map.get(id);
	}

	getCues(ids: Set<number>): Map<number, Cue> {
		const temp = new Map();
		this._map.forEach((v, k) => (ids.has(k) ? temp.set(k, v) : void 0));
		return temp;
	}

	getAllCues(): Map<number, Cue> {
		return this._map;
	}
}
