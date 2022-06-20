import { isWithinRange, DMXToPercent, PercentToDMX } from "../util/DMX512";
import { Transition, TimingEvents } from "./Transition";

export enum ChannelValueType {
	PERCENT,
	DMX
}

export interface ChannelOptions {
	defaultValue: number;
	// valueType: ChannelValueType;
}

export class Channel {
	options: ChannelOptions;
	rawValue: number;
	transition: Transition;

	constructor(options: ChannelOptions) {
		this.options = options;
		this._checkOptions();

		this.transition = null;
	}

	initialise() {
		this.rawValue = this.options.defaultValue;
	}

	private _checkOptions() {
		if (!isWithinRange(this.options.defaultValue)) {
			throw new RangeError("defaultValue out of valid DMX512 range");
		}
	}

	setValue(value: number) {
		if (this.transition) return;
		// ! don't allow changes whilst being controlled by Transition (as it would cause jumping back and forth)
		// ? OR immediately null controlling transition and set to given value
	}

	assignTransition(transition: Transition) {
		this.transition = transition;
		const handleTransitionUpdate = (t: Transition) => (this.rawValue = t.value);

		transition.on(TimingEvents.END, () => {
			transition.removeListener(TimingEvents.UPDATE, handleTransitionUpdate);
			this.transition = null;
		});
		transition.on(TimingEvents.UPDATE, handleTransitionUpdate);
	}
}

module.exports = Channel;
