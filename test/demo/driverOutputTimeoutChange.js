/* 
 *  This is the default license template.
 *  
 *  File: driverOutputTimeoutChange.js
 *  Author: Owner
 *  Copyright (c) 2022 Owner
 *  
 *  To edit this license information: Press Ctrl+Shift+P and press 'Create new License Template...'.
 */

const {Universe} = require("../out/models/Universe");

const u = new Universe("COM9")
u.init()
u.updateSelect([null, 0, 0, 0, 0, 0, 0, 255, 0, 0, 0])

setTimeout(() => u.update(10, 255), 5 * 000)
setTimeout(() => u.update(10, 127), 7 * 1000)