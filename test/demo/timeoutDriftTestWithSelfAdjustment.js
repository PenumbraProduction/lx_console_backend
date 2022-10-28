/* 
 *  This is the default license template.
 *  
 *  File: timeoutDriftTestWithSelfAdjustment.js
 *  Author: Owner
 *  Copyright (c) 2022 Owner
 *  
 *  To edit this license information: Press Ctrl+Shift+P and press 'Create new License Template...'.
 */

duration = 5000; // 5 seconds

totalFrames = 100; // split into 100 `setTimeout` functions
currentFrame = 0;
deltaTime = duration / totalFrames;

const start = performance.now();
function ended() {
    const end = performance.now();
    const timeTaken = end-start;
    console.log(`Expected ${duration}. Took ${timeTaken}`);
    console.log(`Drifted overall by ${Math.round(timeTaken-duration)}ms`);
}

let expected = Date.now() + deltaTime;
function step() {
    // calculate difference between time taken and expected time
    const dt = Date.now() - expected; // the drift for this iteration
	if (currentFrame == totalFrames) return ended();
	currentFrame++;
    expected += deltaTime
	setTimeout(step, Math.max(0, deltaTime - dt)); // decrease the delay by the drift for next iteration
};
setTimeout(step, deltaTime);
