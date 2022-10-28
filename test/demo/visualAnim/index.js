/* 
 *  This is the default license template.
 *  
 *  File: index.js
 *  Author: Owner
 *  Copyright (c) 2022 Owner
 *  
 *  To edit this license information: Press Ctrl+Shift+P and press 'Create new License Template...'.
 */

// const { Transition, TransitionGroup, TimingEvents } = require("../out/models/Transition");

const t1 = new myDmx.Transition(0, 50, 5 * 1000, 0 * 1000);
const t2 = new myDmx.Transition(0, 100, 5 * 1000, 2 * 1000);
const t3 = new myDmx.Transition(0, 20, 2 * 1000, 0 * 1000);
const t4 = new myDmx.Transition(80, 90, 3 * 1000, 2 * 1000);

const tg1 = new myDmx.TransitionGroup([t1, t2, t3, t4]);

const t5 = new myDmx.Transition(50, 80, 1 * 1000, 0 * 1000);
const t6 = new myDmx.Transition(100, 0, 6 * 1000, 1 * 1000);
const t7 = new myDmx.Transition(20, 80, 2 * 1000, 5 * 1000);
const t8 = new myDmx.Transition(90, 30, 3 * 1000, 2 * 1000);

const tg2 = new myDmx.TransitionGroup([t5, t6, t7, t8], 5000);

const groups = [tg1, tg2];

for (let j = 0; j < groups.length; j++) {
	for (let i = 0; i < groups[j].transitions.length; i++) {
		const transition = groups[j].transitions[i];
		if (j == 0) updatePreview(i + 1, transition.initial);
		transition.on(myDmx.TimingEvents.TRIGGER, (t) => console.log(`g${j + 1} t${i + 1}: Triggered`));
		transition.on(myDmx.TimingEvents.START, (t) => console.log(`g${j + 1} t${i + 1}: Started`));
		transition.on(myDmx.TimingEvents.UPDATE, (t) => updatePreview(i + 1, t.value)); //console.log(`g${j+1} t${i+1}: ${transition.value}`)
		transition.on(myDmx.TimingEvents.WARNING, (t, driftStats) =>
			console.log(
				`g${j + 1} t${i + 1}: Running Behind: ${driftStats.delta}ms, ${
					driftStats.remainingFrames
				} remaining frames, ${driftStats.completeFramesPassed} frames passed`
			)
		);
		transition.on(myDmx.TimingEvents.JUMPING, (t, jumpStats) =>
			console.log(
				`g${j + 1} t${i + 1}: Jumping: ${jumpStats.jumpFrames} frames, ${jumpStats.jumpValue} raw value, ${
					jumpStats.jumpTime
				}ms`
			)
		);
		transition.on(myDmx.TimingEvents.END, () => console.log(`g${j + 1} t${i + 1}: ended`));
		transition.on(myDmx.TimingEvents.PAUSED, () => {
			console.log(`g${j + 1} t${i + 1}: Paused`);
		});
		transition.on(myDmx.TimingEvents.RESUMED, () => {
			console.log(`g${j + 1} t${i + 1}: Resumed`);
		});
		transition.on(myDmx.TimingEvents.CANCELLED, () => console.log(`g${j + 1} t${i + 1}: Cancelled`));
	}
}

const anim = new myDmx.Anim(groups);

anim.on(myDmx.TimingEvents.TRIGGER, (a) => console.log("a: Triggered"));
anim.on(myDmx.TimingEvents.START, (a) => console.log("a: Started"));
anim.on(myDmx.TimingEvents.END, (a) => console.timeEnd("timer"));
anim.on(myDmx.TimingEvents.PAUSED, (a) => {
	console.log("Paused");
	console.time("Paused");
});
anim.on(myDmx.TimingEvents.RESUMED, (a) => {
	console.log("Resumed");
	console.timeEnd("Paused");
});
anim.on(myDmx.TimingEvents.CANCELLED, (a) => console.log("Cancelled"));

anim.trigger();
console.time("timer");

// uncomment to emulate pausing
// setTimeout(() => anim.pause(), 1500);
// setTimeout(() => anim.resume(), 5000);

function updatePreview(num, val) {
	document.querySelectorAll(`[data-previewsChannel="${num}"]`).forEach((ch) => {
		ch.children[0].innerText = val;
		ch.children[0].style.height = `${val}%`;
	});
}
