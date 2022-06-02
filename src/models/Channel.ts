import { isWithinRange } from "../util/DMX512";
import { Transition, TimingEvents } from "./Transition";

interface ChannelOptions {
	defaultValue: number;
}

class Channel {
	options: ChannelOptions;
	value: number;

	constructor(options: ChannelOptions) {
		this.options = options;

		this._checkOptions(options);

		this.value = options.defaultValue;
	}

	private _checkOptions(options: ChannelOptions) {
		if (!isWithinRange(options.defaultValue)) {
			throw new RangeError("defaultValue out of valid DMX512 range");
		}
	}

	assignTransition(transition: Transition) {
		const handleTransitionUpdate = () => {};

		transition.on(TimingEvents.END, () => transition.removeListener(TimingEvents.UPDATE, handleTransitionUpdate));
		transition.on(TimingEvents.UPDATE, handleTransitionUpdate);
	}
}

module.exports = Channel;
