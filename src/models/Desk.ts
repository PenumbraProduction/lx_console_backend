import { USB_Device } from "../types";
import { SerialPort } from "serialport";

import { Universe } from "./Universe";
import PatchManager from "./channels/PatchManager";
import GroupManager from "./groups/GroupManager";
import CueManager from "./cues/CueManager";
import PlaybackManager from "./playbacks/PlaybackManager";

export class Desk {
	universe: Universe;
	interfacePort?: USB_Device;
	patch: PatchManager;
    groups: GroupManager;
    cues: CueManager;
    playbacks: PlaybackManager;

	constructor() {
		this.universe = new Universe();

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
				reject("Failed to identify any valid connected devices");
			});
		});
	}

	async init() {
		this.interfacePort = await this.findInterfacePort();
		await this.universe.init(this.interfacePort.path);
	}
}
