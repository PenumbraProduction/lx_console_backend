import { MapOverlapError } from "../../Errors/OverlapError";
import { Group } from "./Group";

export default class GroupManager {
	private _map: Map<number, Group>;

	constructor() {
		this._map = new Map<number, Group>();
	}

	addGroup(group: Group): GroupManager {
		if (this._map.has(group.id)) throw new MapOverlapError(`GroupManager Map entry '${group.id}' already exists`);
        this._map.set(group.id, group);
		return this;
	}

	moveGroup(id1: number, id2: number):GroupManager {
		if (!this._map.has(id1)) throw new Error(`Cannot move group, source group ${id1} does not exist`);
		if (this._map.has(id2)) throw new MapOverlapError(`Cannot move group, GroupManager Map entry '${id2}' already exists`);
		const g = this._map.get(id1);
		g._setId(id2)
		this._map.set(id2, g);
		this._map.delete(id1);
		return this;
	}

	removeGroup(id: number): GroupManager {
        this._map.delete(id);
        return this;
    }

	getGroup(id: number): Group | undefined {
        return this._map.get(id);
    }

	getAllGroups(): Map<number, Group> {
		return this._map;
	}
}
