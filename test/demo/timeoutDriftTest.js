/* 
 *  This is the default license template.
 *  
 *  File: timeoutDriftTest.js
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

function step() {
	if (currentFrame == totalFrames) return ended();
	currentFrame++;
	setTimeout(step, deltaTime);
};
setTimeout(step, deltaTime);
