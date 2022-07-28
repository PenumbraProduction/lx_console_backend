const start = new Date();
let i = 0
const interval = setInterval(function(){
    if (++i >= 1000) {
        const end = new Date();
        console.log("The average interval was " + ((end-start)/1000) + " milliseconds");
        clearInterval(interval);
    }
}, 0);
