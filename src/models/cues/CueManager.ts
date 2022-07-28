import { MapOverlapError } from "../../Errors/OverlapError";
import { Cue } from "./Cue";

export default class CueManager {
	private _map: Map<number, Cue>;

	constructor() {
		this._map = new Map<number, Cue>();
	}

	addCue(cue: Cue): CueManager {
		if (this._map.has(cue.id)) throw new MapOverlapError(`CueManager Map entry '${cue.id}' already exists`);
        this._map.set(cue.id, cue);
		return this;
	}

	removeCue(id: number): CueManager {
        this._map.delete(id);
        return this;
    }

	getCue(id: number): Cue | undefined {
        return this._map.get(id);
    }
}
