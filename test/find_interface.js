
// find device
const {SerialPort} = require("serialport");
const sf = require("sf");

(async function () {
	const results = await SerialPort.list();
	for (let i = 0; i < results.length; i++) {
		const item = results[i];
		console.log(sf("{path,-15} {pnpId,-20} {manufacturer}", item));
	}
})();
