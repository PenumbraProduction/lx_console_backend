const util = require("util");

const { Desk } = require("../out/src/models/Desk");
const { Group } = require("../out/src/models/groups/Group");

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

console.log(util.inspect(desk.patch, { depth: null }));



const g1 = new Group({ id: 1, channels: new Set([1, 2]) });
desk.groups.addGroup(g1);

console.log(util.inspect(desk.groups, { depth: null }));
desk.groups.moveGroup(1, 5);
console.log(util.inspect(desk.groups, { depth: null }));
desk.groups.getGroup(5).setName("Hello G1")
console.log(util.inspect(desk.groups, { depth: null }));


(async function() {
	await desk.init();

	console.log(desk.interfacePort)
}())