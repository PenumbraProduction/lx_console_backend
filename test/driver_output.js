
const {Universe} = require("../out/models/Universe");

const u = new Universe("COM9")
u.init()

// index 0 is ignored as DMX */0 doesn't exist
u.updateSelect([null, 0, 0, 0, 0, 0, 0, 255, 0, 0, 0]) // set some default values