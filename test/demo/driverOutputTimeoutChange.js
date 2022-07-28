
const {Universe} = require("../out/models/Universe");

const u = new Universe("COM9")
u.init()
u.updateSelect([null, 0, 0, 0, 0, 0, 0, 255, 0, 0, 0])

setTimeout(() => u.update(10, 255), 5 * 000)
setTimeout(() => u.update(10, 127), 7 * 1000)