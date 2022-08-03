
// find device
const {SerialPort} = require("serialport");

(async function () {
	const results = await SerialPort.list();
	for (let i = 0; i < results.length; i++) {
		const item = results[i];
		console.log(item);
	}
})();
