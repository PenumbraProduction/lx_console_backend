import { EventEmitter } from "events";
import { USB_Device } from "../types";
import { SerialPort } from "serialport";

import { Universe } from "./Universe";
import { PatchManager } from "./channels/PatchManager";
import { GroupManager } from "./groups/GroupManager";
import { CueManager } from "./cues/CueManager";
import { PlaybackManager } from "./playbacks/PlaybackManager";

export class Desk extends EventEmitter {
	universe: Universe;
	interfacePort?: USB_Device;
	patch: PatchManager;
	groups: GroupManager;
	cues: CueManager;
	playbacks: PlaybackManager;

	constructor() {
		super();

		this.universe = new Universe();

		this.patch = new PatchManager();
		this.groups = new GroupManager();
		this.cues = new CueManager();
		this.playbacks = new PlaybackManager();

		// this._attachEventListeners();
	}

	// private _attachEventListeners() {
	// 	this.universe.on("bufferUpdate", (data) => {
	// 		if (!data) data = this.universe.getUniverseBuffer();
	// 		this.emit("bufferUpdate", data);
	// 	});

	// 	this.universe.on("serialportClose", () => this.emit("serialportClose"));
	// 	this.universe.on("serialportEnd", () => this.emit("serialportEnd"));
	// 	this.universe.on("serialportError", (e: Error) => this.emit("serialportError", e));

	// 	this.patch.on("patchAdd", (channel: Channel) => this.emit("patchAdd", channel));
	// 	this.patch.on("patchDelete", (id: number) => this.emit("patchDelete", id));
	// 	this.patch.on("patchMove", (id1: number, id2: number) => this.emit("patchMove", id1, id2));
	// }

	private findInterfacePort(): Promise<USB_Device> {
		return new Promise<USB_Device>((resolve, reject) => {
			SerialPort.list().then((results) => {
				for (let i = 0; i < results.length; i++) {
					const item = results[i];
					if (item.vendorId == "0403" && item.productId == "6001") return resolve(item as USB_Device);
				}
				reject(new Error("Failed to identify any valid connected devices"));
			});
		});
	}

	async init() {
		// ! make sure this is always in a separate function so the desk can continue to run just without outputting any DMX to device
		this.interfacePort = await this.findInterfacePort();
		await this.universe.init(this.interfacePort.path);
		this.universe.start();
		//
	}

	async close() {
		this.universe.close();
	}
}
