/* 
 *  This is the default license template.
 *  
 *  File: find_interface.js
 *  Author: Owner
 *  Copyright (c) 2022 Owner
 *  
 *  To edit this license information: Press Ctrl+Shift+P and press 'Create new License Template...'.
 */

// find device
const {SerialPort} = require("serialport");

(async function () {
	const results = await SerialPort.list();
	for (let i = 0; i < results.length; i++) {
		const item = results[i];
		console.log(item);
	}
})();
