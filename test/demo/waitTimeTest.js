const {wait} = require("../out/util/time");

(async function() {
    const start = performance.now();
    await wait(1)
    const end = performance.now()
    console.log(end-start);
}())
