/* 
 *  This is the default license template.
 *  
 *  File: driverOutputTransitions.js
 *  Author: Owner
 *  Copyright (c) 2022 Owner
 *  
 *  To edit this license information: Press Ctrl+Shift+P and press 'Create new License Template...'.
 */

const {Universe} = require("../out/models/Universe");
const {Transition, TransitionGroup, TimingEvents} = require("../out/models/Transition");

const u = new Universe("COM9")

u.init()

// index 0 is ignored as DMX */0 doesn't exist
u.updateSelect([null, 0, 0, 0, 0, 0, 0, 255, 0, 0, 255])


const intT = new Transition(255, 0, 5 * 1000, 3 * 1000, {frames: 120});
intT.on(TimingEvents.UPDATE, (t, val) => {
    u.updateSelect({10: t.value})
})

const panT = new Transition(66, 200, 4 * 1000, 0, {frames: 120});
panT.on(TimingEvents.UPDATE, (t, val) => {
    u.updateSelect({1: t.value})
})

const tiltT = new Transition(0, 125, 3 * 1000, 1 * 1000, {frames: 120});
tiltT.on(TimingEvents.UPDATE, (t, val) => {
    u.updateSelect({3: t.value})
})

const tg = new TransitionGroup([intT, panT, tiltT], 3*1000)

tg.trigger()