/* 
 *  This is the default license template.
 *  
 *  File: iterationSpeed.js
 *  Author: Owner
 *  Copyright (c) 2022 Owner
 *  
 *  To edit this license information: Press Ctrl+Shift+P and press 'Create new License Template...'.
 */

const start = new Date();
let i = 0
const interval = setInterval(function(){
    if (++i >= 1000) {
        const end = new Date();
        console.log("The average interval was " + ((end-start)/1000) + " milliseconds");
        clearInterval(interval);
    }
}, 0);
