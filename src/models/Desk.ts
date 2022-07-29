import { EventEmitter } from "events";
import { USB_Device } from "../types";
import { SerialPort } from "serialport";

import { Universe } from "./Universe";
import { PatchManager } from "./channels/PatchManager";
import { GroupManager } from "./groups/GroupManager";
import { CueManager } from "./cues/CueManager";
import { PlaybackManager } from "./playbacks/PlaybackManager";
import { Programmer } from "./Programmer";
import { CommandLine } from "./CommandLine";

export class Desk extends EventEmitter {
	universe: Universe;
	interfacePort?: USB_Device;
	commandLine: CommandLine;
	programmer: Programmer;
	patch: PatchManager;
	groups: GroupManager;
	cues: CueManager;
	playbacks: PlaybackManager;

	constructor() {
		super();

		this.universe = new Universe();
		this.interfacePort = null;

		this.commandLine = new CommandLine();
		this.programmer = new Programmer();
		this.patch = new PatchManager();
		this.groups = new GroupManager();
		this.cues = new CueManager();
		this.playbacks = new PlaybackManager();
	}

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
		//
	}

	async close() {
		this.universe.close();
	}
}
