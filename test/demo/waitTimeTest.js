/* 
 *  This is the default license template.
 *  
 *  File: waitTimeTest.js
 *  Author: Owner
 *  Copyright (c) 2022 Owner
 *  
 *  To edit this license information: Press Ctrl+Shift+P and press 'Create new License Template...'.
 */

const {wait} = require("../out/util/time");

(async function() {
    const start = performance.now();
    await wait(1)
    const end = performance.now()
    console.log(end-start);
}())
