const { Transition, TimingEvents } = require("../out/models/Transition");

const t = new Transition(0, 100, 5 * 1000, 0, { frames: 100 });

t.on(TimingEvents.TRIGGER, (t) => console.log("t: Triggered"));
t.on(TimingEvents.START, (t) => console.log("t: Started"));
t.on(TimingEvents.UPDATE, (t) => console.log(`t: ${t.value}`));
t.on(TimingEvents.WARNING, (t, driftStats) =>
	console.log(
		`t: Running Behind: ${driftStats.delta}ms, ${driftStats.remainingFrames} remaining frames, ${driftStats.completeFramesPassed} frames passed`
	)
);
t.on(TimingEvents.JUMPING, (t, jumpStats) =>
	console.log(`t: Jumping: ${jumpStats.jumpFrames} frames, ${jumpStats.jumpValue} raw value, ${jumpStats.jumpTime}ms`)
);
t.on(TimingEvents.END, () => console.timeEnd("timer"));
t.on(TimingEvents.PAUSED, () => {
	console.log("Paused");
	console.time("Paused");
});
t.on(TimingEvents.RESUMED, () => {
	console.log("Resumed");
	console.timeEnd("Paused");
});
t.on(TimingEvents.CANCELLED, () => console.log("Cancelled"));

console.time("timer");
t.trigger();

// const t2 = new Transition(0, 100, 5 * 1000, 2 * 1000, { frames: 100 });

// t2.on(TimingEvents.TRIGGER, () => console.log("t2: Triggered"))
// t2.on(TimingEvents.START, () => console.log("t2: Started"));
// t2.on(TimingEvents.UPDATE, (val) => console.log(`t2: ${val}`));
// t2.on(TimingEvents.WARNING, (dt) => console.log(`t2: Delta Time running over expected delta: ${dt}`));
// t2.on(TimingEvents.END, () => console.timeEnd("timer2"));
// t2.on(TimingEvents.PAUSED, () => {
// 	console.log("Paused");
// 	console.time("Paused");
// });
// t2.on(TimingEvents.RESUMED, () => {
// 	console.log("Resumed");
// 	console.timeEnd("Paused");
// });
// t2.on(TimingEvents.CANCELLED, () => console.log("Cancelled"));

// console.time("timer2");
// t2.trigger();
