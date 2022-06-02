import { EventEmitter } from "events";

// ? create a skip delay method that immediately starts changing values no matter how long the delay has been going for

enum TransitionStates {
	UNTRIGGERED,
	UNSTARTED,
	RUNNING,
	PAUSED,
	CANCELLED,
	ENDED, // both ended naturally and ended "now"
	RECALCULATING // when any "delta" values have been changed while running
}

export enum TimingEvents {
	TRIGGER = "trigger",
	START = "start",
	UPDATE = "update",
	WARNING = "warning",
	JUMPING = "jumping",
	END = "end",
	PAUSED = "paused",
	RESUMED = "resumed",
	CANCELLED = "cancelled"
}

export class Transition extends EventEmitter {
	initial: number;
	rawValue: number;
	value: number;
	final: number;
	duration: number;
	state: TransitionStates;
	frames: number;
	runningTimeoutID: NodeJS.Timeout;
	delayTimeoutID: NodeJS.Timeout;
	deltaVal: number;
	deltaTime: number;
	current_frame: number;
	delay: number;
	delayStartTime: number;

	constructor(initial: number, final: number, duration: number, delay: number = 0, options = { frames: 100 }) {
		super(); // call constructor for EventEmitter

		this.initial = initial;
		this.rawValue = initial;
		this.value = initial;
		this.final = final;
		this.duration = duration;
		this.delay = delay;

		this.state = TransitionStates.UNTRIGGERED;

		this.frames = options.frames; // number of times to update the value in the given time (can allow jumps of more than 1 at a time if set too low)
		// more frames means smoother changes over time but will result in incorrect timings for very quick transitions
		// todo: default frames should be adjusted based on time (very quick: fewer frames, medium time: many frames, very long: fewer frames)

		this._calculateFrameStepValues();

		this.delayStartTime = null;
		this.delayTimeoutID = null;
		this.runningTimeoutID = null;
	}

	private _calculateFrameStepValues() {
		// works from current value in the case these need recalculating mid-change
		// has no effect on start as current value should be same as initial value
		this.deltaVal = (this.final - this.value) / this.frames; // `deltaVal` variable which is how much the property should change in each iteration
		this.deltaTime = this.duration / this.frames; // `deltaTime` variable which is long to wait before next iteration
		this.current_frame = 0; // if the values have been recalculated then the frames need to be set back to zero, in the case where this is the first calculation then current_frame is already 0
	}

	// start the transition
	trigger() {
		this.state = TransitionStates.UNSTARTED;
		this.emit(TimingEvents.TRIGGER, this);
		if (this.delay) this._startDelay();
		else {
			this._startRunning();
			this.emit(TimingEvents.START, this);
		}
	}

	private _startDelay() {
		this.delayStartTime = Date.now();
		this.delayTimeoutID = setTimeout(() => {
			this._startRunning();
			this.emit(TimingEvents.START, this);
		}, this.delay);
	}

	private _startRunning() {
		this.state = TransitionStates.RUNNING;

		let expected = Date.now() + this.deltaTime;

		const step = () => {
			if (this.state !== TransitionStates.RUNNING) return;

			var dt = Date.now() - expected; // the drift (positive for overshooting)
			if (dt > this.deltaTime) { // running slow by more than one frame
				
				// jump multiple frames to catch up as early as possible
				const remainingFrames = this.frames - this.current_frame;
				const completeFramesPassed = Math.floor(dt / this.deltaTime);

				this.emit(TimingEvents.WARNING, this, {delta: dt, remainingFrames, completeFramesPassed}); // warn that more than 1 frame has passed

				let jumpFrames = Math.min(remainingFrames, completeFramesPassed) - 1; // less one because another frame is added after this
				if (jumpFrames > 0) {
					const jumpValue = this.deltaVal * jumpFrames
					const jumpTime = this.deltaTime * jumpFrames
					this.emit(TimingEvents.JUMPING, this, {jumpFrames, jumpValue, jumpTime});
					this.current_frame += jumpFrames;
					this.rawValue += jumpValue;
					expected += jumpTime;
				}
			}

			//check that end of the transition has not been reached
			if (this.current_frame < this.frames) {
				this.rawValue += this.deltaVal;
				this.value = Math.floor(this.rawValue);
				this.emit(TimingEvents.UPDATE, this);
			} else {
				this.endNow();
				return;
			}

			this.current_frame++;
			expected += this.deltaTime;

			this.runningTimeoutID = setTimeout(step, Math.max(0, this.deltaTime - dt)); // take into account drift
		};
		this.runningTimeoutID = setTimeout(step, this.deltaTime);
	}

	// update the time until end whilst running
	updateRunningTime(duration: number): void {
		if (this.state !== TransitionStates.RUNNING) {
			return;
		}
		this.state = TransitionStates.RECALCULATING;
		clearTimeout(this.runningTimeoutID);
		this.duration = duration;
		this._calculateFrameStepValues();
		this._startRunning();
	}

	// update the end value whilst running
	updateRunningEnd(final: number): void {
		if (this.state !== TransitionStates.RUNNING) {
			return;
		}
		this.state = TransitionStates.RECALCULATING;
		clearTimeout(this.runningTimeoutID);
		this.final = final;
		this._calculateFrameStepValues();
		this._startRunning();
	}

	// stop changing values with the intention of continuing to change later
	pause() {
		if (this.state == TransitionStates.UNSTARTED) {
			clearTimeout(this.delayTimeoutID);
			this.delay = Date.now() - this.delayStartTime;
		} else if (this.state == TransitionStates.RUNNING) {
			clearTimeout(this.runningTimeoutID);
		} else {
			return;
		}
		this.state = TransitionStates.PAUSED;
		this.emit(TimingEvents.PAUSED, this);
	}

	// resume changing values after pause
	resume() {
		if (this.state !== TransitionStates.PAUSED) {
			return;
		}
		if (this.delay) this._startDelay();
		else this._startRunning();
		this.emit(TimingEvents.RESUMED, this);
	}

	// stop changing values but Don't emit "end" event
	cancel() {
		if (this.state == TransitionStates.UNSTARTED) clearTimeout(this.delayTimeoutID);
		if (this.state == TransitionStates.RUNNING) clearTimeout(this.runningTimeoutID);
		this.state = TransitionStates.CANCELLED;
		this.emit(TimingEvents.CANCELLED, this);
	}

	// set changing value to end and emit "end" event
	endNow() {
		if (this.state == TransitionStates.UNSTARTED) clearTimeout(this.delayTimeoutID);
		if (this.state == TransitionStates.RUNNING) clearTimeout(this.runningTimeoutID);
		this.value = this.final;
		this.state = TransitionStates.ENDED;
		this.emit(TimingEvents.UPDATE, this);
		this.emit(TimingEvents.END, this);
	}
}

export class TransitionGroup extends EventEmitter {
	transitions: Transition[];
	state: TransitionStates;
	delay: number;

	constructor(transitions: Transition[], delay?: number) {
		super();

		if (!transitions.length) {
			throw new RangeError("Transition array is empty");
		}

		this.transitions = transitions;
		this.delay = delay;

		if (delay) {
			const length = this.transitions.length;
			for (let i = 0; i < length; i++) {
				this.transitions[i].delay += this.delay;
			}
		}

		this.state = TransitionStates.UNTRIGGERED;
	}

	// ?: recalculate longest if updateRunningTime is called on any Transitions (changes to end value are irrelevant, larger or smaller deltaValues are used to reach it in the same set time)
	// ?: individual transitions would not have that called on them, the only time in which the TIME changes is when an entire group (or anim) must finish early (due to double press or other emergency user input)
	trigger(): void {
		// find longest (add duration and delay)
		const longest = this.transitions.reduce((prev, current) =>
			prev.delay + prev.duration > current.delay + current.duration ? prev : current
		);
		// ?: listen to ALL Transitions and only end when all Transitions have ended or stick with only calculating the longest?
		// listen to end of longest event
		const handleEndLongest = () => {
			// on end fire end event
			this.emit(TimingEvents.END, this);

			longest.removeListener(TimingEvents.END, handleEndLongest);
		};
		longest.on(TimingEvents.END, handleEndLongest);

		this.state = TransitionStates.UNSTARTED;
		this.emit(TimingEvents.TRIGGER, this);

		this._startRunning();
		this.emit(TimingEvents.START, this);
	}

	private _startRunning() {
		this.state = TransitionStates.RUNNING;
		// trigger all Transitions
		const length = this.transitions.length;
		for (let i = 0; i < length; i++) {
			this.transitions[i].trigger();
		}
	}

	// the duration changes is when an entire group (or anim) must finish early (due to double press or other emergency user input)
	updateRunningTime(duration: number): void {
		if (this.state !== TransitionStates.RUNNING) {
			return;
		}
		this.state = TransitionStates.RECALCULATING;
		const length = this.transitions.length;
		for (let i = 0; i < length; i++) {
			this.transitions[i].updateRunningTime(duration);
		}
		this.state = TransitionStates.RUNNING;
		// No need to update the event being listened to as now they should all end at the same time
	}

	// update the end value whilst running
	updateRunningEnd(final: number): void {
		// ?: is this needed here? I dont; think so, I think this becomes obsolete as a different transition will take control (and end this one) if the final value needs to change
	}

	// stop changing values with the intention of continuing to change later
	pause() {
		if (this.state !== TransitionStates.RUNNING) return;
		this.state = TransitionStates.PAUSED;
		const length = this.transitions.length;
		for (let i = 0; i < length; i++) {
			this.transitions[i].pause();
		}
		this.emit(TimingEvents.PAUSED, this);
	}

	// resume changing values after pause
	resume() {
		if (this.state !== TransitionStates.PAUSED) return;
		const length = this.transitions.length;
		for (let i = 0; i < length; i++) {
			this.transitions[i].resume();
		}
		this.emit(TimingEvents.RESUMED, this);
	}

	// stop changing values but Don't emit "end" event
	cancel() {
		this.state = TransitionStates.CANCELLED;
		const length = this.transitions.length;
		for (let i = 0; i < length; i++) {
			this.transitions[i].cancel();
		}
		this.emit(TimingEvents.CANCELLED, this);
	}

	// set changing value to end and emit "end" event
	endNow() {
		this.state = TransitionStates.ENDED;
		const length = this.transitions.length;
		for (let i = 0; i < length; i++) {
			this.transitions[i].endNow();
		}
		this.emit(TimingEvents.END, this);
	}
}

export class Anim extends EventEmitter {
	groups: TransitionGroup[];
	state: TransitionStates;
	groupIndex: number;

	constructor(groups: TransitionGroup[]) {
		super();

		this.groups = groups;
		this.groupIndex = 0;

		this.state = TransitionStates.UNTRIGGERED;
	}

	trigger(): void {
		// listen to end of transitionGroup
		const handleEndGroup = () => {
			// on end start next group or, if that was the last, fire end event

			this.groups[this.groupIndex].removeListener(TimingEvents.END, handleEndGroup);
		};
		this.groups[this.groupIndex].on(TimingEvents.END, handleEndGroup);

		this.state = TransitionStates.UNSTARTED;
		this.emit(TimingEvents.TRIGGER, this);

		this._startRunning();
		this.emit(TimingEvents.START, this);
	}

	private _startRunning() {
		this.state = TransitionStates.RUNNING;
		// trigger first group
		this.groups[this.groupIndex].trigger();
	}

	// stop changing values with the intention of continuing to change later
	pause() {
		if (this.state !== TransitionStates.RUNNING) return;
		this.state = TransitionStates.PAUSED;
		this.groups[this.groupIndex].pause();
		this.emit(TimingEvents.PAUSED, this);
	}

	// resume changing values after pause
	resume() {
		if (this.state !== TransitionStates.PAUSED) return;
		this.groups[this.groupIndex].resume();
		this.emit(TimingEvents.RESUMED, this);
	}

	// stop changing values
	cancel() {
		this.state = TransitionStates.CANCELLED;
		this.groups[this.groupIndex].cancel();
		this.emit(TimingEvents.CANCELLED, this);
	}

	// set changing value to end and emit "end" event
	// ! go through all groups (that haven't already been played) and endNow
	// because the last group might not change some values that have been changed in previous groups (kinda like tracking)
	// endNow() {
	// 	this.state = TransitionStates.ENDED;
	// 	this.groups[this.groupIndex].endNow();
	// 	this.emit(TimingEvents.END, this);
	// }
}
