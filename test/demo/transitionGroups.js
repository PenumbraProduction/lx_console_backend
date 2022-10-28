/* 
 *  This is the default license template.
 *  
 *  File: transitionGroups.js
 *  Author: Owner
 *  Copyright (c) 2022 Owner
 *  
 *  To edit this license information: Press Ctrl+Shift+P and press 'Create new License Template...'.
 */

const { Transition, TransitionGroup, TimingEvents } = require("../out/models/Transition");

const t1 = new Transition(0, 50, 5 * 1000, 0 * 1000);
const t2 = new Transition(0, 100, 5 * 1000, 2 * 1000);
const t3 = new Transition(0, 20, 2 * 1000, 0 * 1000);
const t4 = new Transition(80, 90, 3 * 1000, 2 * 1000);

const group = [t1, t2, t3, t4];

for (let i = 0; i < group.length; i++) {
	const transition = group[i];
	const num = i + 1;
	transition.on(TimingEvents.TRIGGER, (t) => console.log(`t${num}: Triggered`));
	transition.on(TimingEvents.START, (t) => console.log(`t${num}: Started`));
	transition.on(TimingEvents.UPDATE, (t) => console.log(`t${num}: ${transition.value}`));
	transition.on(TimingEvents.WARNING, (t, driftStats) =>
		console.log(
			`t${num}: Running Behind: ${driftStats.delta}ms, ${driftStats.remainingFrames} remaining frames, ${driftStats.completeFramesPassed} frames passed`
		)
	);
	transition.on(TimingEvents.JUMPING, (t, jumpStats) =>
		console.log(
			`t${num}: Jumping: ${jumpStats.jumpFrames} frames, ${jumpStats.jumpValue} raw value, ${jumpStats.jumpTime}ms`
		)
	);
	transition.on(TimingEvents.END, () => console.log(`t${num}: ended`));
	transition.on(TimingEvents.PAUSED, () => {
		console.log(`t${num}: Paused`);
	});
	transition.on(TimingEvents.RESUMED, () => {
		console.log(`t${num}: Resumed`);
	});
	transition.on(TimingEvents.CANCELLED, () => console.log(`t${num}: Cancelled`));
}

const tg = new TransitionGroup(group);

tg.on(TimingEvents.TRIGGER, (tg) => console.log("tg: Triggered"));
tg.on(TimingEvents.START, (tg) => console.log("tg: Started"));
tg.on(TimingEvents.END, (tg) => console.timeEnd("timer"));
tg.on(TimingEvents.PAUSED, (tg) => {
	console.log("Paused");
	console.time("Paused");
});
tg.on(TimingEvents.RESUMED, (tg) => {
	console.log("Resumed");
	console.timeEnd("Paused");
});
tg.on(TimingEvents.CANCELLED, (tg) => console.log("Cancelled"));

tg.trigger();
console.time("timer");

setTimeout(() => tg.pause(), 1500);
setTimeout(() => tg.resume(), 5000);
