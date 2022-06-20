import { EventEmitter } from "events";
import * as SerialPort from "serialport";
import { wait } from "../util/time";

export type UniverseData = {
	[key: number]: number;
};

export interface IUniverseDriver extends EventEmitter {
	init(): Promise<void>;

	get(channel: number): number;

	update(channel: number, value: number): void;
	updateSelect(channels: UniverseData, extraData?: any): void;
	updateAll(value: number): void;

	close(): Promise<void> | void;
}

export class Universe extends EventEmitter implements IUniverseDriver {
	private readonly _universeBuffer: Buffer;

	private _readyToWrite: boolean;
	private _serialPort!: SerialPort.SerialPort;
	private readonly _serialPortName: string;

	private readonly _sendInterval: number;
	private _intervalHandle: any | undefined = undefined;

	constructor(serialPortName: string) {
		super();

		this._universeBuffer = Buffer.alloc(513);

		this._serialPortName = serialPortName;

		this._readyToWrite = false;

		this._sendInterval = 46;
	}

	init(): Promise<void> {
		return new Promise((resolve, reject) => {
			this._serialPort = new SerialPort.SerialPort(
				{
					path: this._serialPortName,
					baudRate: 250000,
					dataBits: 8,
					stopBits: 2,
					parity: "none"
				},
				(err) => {
					if (!err) {
						this._readyToWrite = true;
						this.start();
						resolve();
					} else {
						reject(err);
					}
				}
			);
			this._serialPort.on("close", () => {
				console.log("SerialPort Closed");
			});
			this._serialPort.on("end", () => {
				console.log("SerialPort Ended");
			});
			this._serialPort.on("error", (e) => {
				console.log("SerialPort Error");
				console.error(e);
			});
		});
	}

	start(): void {
		if (this._intervalHandle !== undefined) {
			throw new Error("Driver is already running.");
		}
		this._intervalHandle = setInterval(this.sendUniverse.bind(this), this._sendInterval);
	}

	stop(): void {
		if (this._intervalHandle !== undefined) {
			clearInterval(this._intervalHandle);
			this._intervalHandle = undefined;
		}
	}

	close(): Promise<void> {
		this.stop();
		return new Promise((resolve, reject) => this._serialPort.close((err: any) => (err ? reject(err) : resolve())));
	}

	async sendUniverse(): Promise<void> {
		if (!this._serialPort.writable) return;
		if (!this._readyToWrite) return;

		// toggle break
		this._serialPort.set({ brk: true, rts: false });
		await wait(1);
		this._serialPort.set({ brk: false, rts: false });
		await wait(1);

		// ? is this inefficient? Could I not just send whatever value is in index 0 without any effect?
		const dataToWrite = Buffer.concat([Buffer.from([0]), this._universeBuffer.slice(1)]);

		this._readyToWrite = false;
		this._serialPort.write(dataToWrite);
		this._serialPort.drain(() => {
			this._readyToWrite = true;
		});
	}

	get(channel: number): number {
		return this._universeBuffer[channel];
	}

	update(channel: number, value: number): void {
		this._universeBuffer[channel] = value;
	}

	updateSelect(channels: UniverseData): void {
		for (const c in channels) {
			this._universeBuffer[c] = channels[c];
		}
	}

	updateAll(value: number): void {
		for (let i = 1; i <= 512; i++) {
			this._universeBuffer[i] = value;
		}
	}
}
