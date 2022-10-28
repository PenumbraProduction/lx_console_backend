/* 
 *  This is the default license template.
 *  
 *  File: index.js
 *  Author: Owner
 *  Copyright (c) 2022 Owner
 *  
 *  To edit this license information: Press Ctrl+Shift+P and press 'Create new License Template...'.
 */

const util = require("util");

const {Desk, Group } = require("../out");

const desk = new Desk();

const testProfile = {
	id: "123",
	brand: "456",
	name: "TestProfile",
	channels: [{ name: "Dimmer", type: "INTENSITY" }],
	channelModes: [{ count: 1, channels: [0] }],

	options: { channelMode: 0 }
};

desk.patch.addChannel(1, testProfile, 1);
desk.patch.addChannel(2, testProfile, 2);

// console.log(util.inspect(desk.patch, { depth: null }));

console.log(desk.patch.getChannelsByProfileType("123", {channelMode: 0}));