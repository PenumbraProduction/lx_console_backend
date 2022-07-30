import { EventEmitter } from "events";
import { MapOverlapError } from "../../Errors/OverlapError";
import { Group } from "./Group";

export interface GroupManagerEmissions {
	groupAdd: (group: Group) => void;
	groupMove: (id1: number, id2: number) => void;
	groupDelete: (id: number | Set<number>) => void;
}

export class GroupManager extends EventEmitter {
	private _untypedOn = this.on;
	private _untypedEmit = this.emit;
	public on = <K extends keyof GroupManagerEmissions>(event: K, listener: GroupManagerEmissions[K]): this =>
		this._untypedOn(event, listener);
	public emit = <K extends keyof GroupManagerEmissions>(
		event: K,
		...args: Parameters<GroupManagerEmissions[K]>
	): boolean => this._untypedEmit(event, ...args);

	private _map: Map<number, Group>;

	constructor() {
		super();

		this._map = new Map<number, Group>();
	}

	addGroup(group: Group): GroupManager {
		if (this._map.has(group.id)) throw new MapOverlapError(`GroupManager Map entry '${group.id}' already exists`);
		this._map.set(group.id, group);
		this.emit("groupAdd", group);
		return this;
	}

	moveGroup(id1: number, id2: number): GroupManager {
		if (!this._map.has(id1)) throw new Error(`Cannot move group, source group ${id1} does not exist`);
		if (this._map.has(id2))
			throw new MapOverlapError(`Cannot move group, GroupManager Map entry '${id2}' already exists`);
		const g = this._map.get(id1);
		g._setId(id2);
		this._map.set(id2, g);
		this._map.delete(id1);
		this.emit("groupMove", id1, id2);
		return this;
	}

	removeGroup(id: number): GroupManager {
		this._map.delete(id);
		this.emit("groupDelete", id)
		return this;
	}

	removeGroups(ids: Set<number>): GroupManager {
		ids.forEach((id) => this._map.delete(id));
		this.emit("groupDelete", ids);
		return this;
	}

	getGroup(id: number): Group | undefined {
		return this._map.get(id);
	}

	getAllGroups(): Map<number, Group> {
		return this._map;
	}
}
