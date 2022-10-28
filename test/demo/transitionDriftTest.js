/* 
 *  This is the default license template.
 *  
 *  File: transitionDriftTest.js
 *  Author: Owner
 *  Copyright (c) 2022 Owner
 *  
 *  To edit this license information: Press Ctrl+Shift+P and press 'Create new License Template...'.
 */

const { Transition, TimingEvents } = require("../out/models/Transition");

const expectedTime = 5 * 1000; // 5 seconds
const times = [];

for (let i = 0; i < 1000; i++) {
	let start;
	const t = new Transition(0, 100, expectedTime, 0);

	t.on(TimingEvents.START, () => (start = performance.now()));
	t.on(TimingEvents.END, () => times.push(performance.now() - start));

	t.trigger();
}

setTimeout(() => {
	// calculate average drift
	const sum = times.reduce((partialSum, elt) => partialSum + elt, 0);
	const avgTime = sum / times.length;
	const avgDrift = avgTime - expectedTime;
	console.log(avgTime);
	console.log(avgDrift);
}, 6000); // after 6 seconds all should have finished
