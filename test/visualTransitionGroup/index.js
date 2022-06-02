// const { Transition, TransitionGroup, TimingEvents } = require("../out/models/Transition");

const t1 = new myDmx.Transition(0, 50, 5 * 1000, 0 * 1000);
const t2 = new myDmx.Transition(0, 100, 5 * 1000, 2 * 1000);
const t3 = new myDmx.Transition(0, 20, 2 * 1000, 0 * 1000);
const t4 = new myDmx.Transition(80, 90, 3 * 1000, 2 * 1000);

const group = [t1, t2, t3, t4];

for (let i = 0; i < group.length; i++) {
	const transition = group[i];
	const num = i + 1;
	updatePreview(num, transition.initial)
	transition.on(myDmx.TimingEvents.TRIGGER, (t) => console.log(`t${num}: Triggered`));
	transition.on(myDmx.TimingEvents.START, (t) => console.log(`t${num}: Started`));
	transition.on(myDmx.TimingEvents.UPDATE, (t) => updatePreview(num, t.value)); //console.log(`t${num}: ${t.value}`)
	transition.on(myDmx.TimingEvents.END, (t) => console.log(`t${num} Ended`));
	transition.on(myDmx.TimingEvents.PAUSED, (t) => console.log(`t${num} Paused`));
	transition.on(myDmx.TimingEvents.RESUMED, (t) => console.log(`t${num} Resumed`));
	transition.on(myDmx.TimingEvents.CANCELLED, (t) => console.log(`t${num} Cancelled`));
	transition.on(myDmx.TimingEvents.WARNING, (t, dt) => console.log(`t${num} Running ${dt}ms behind expected value, skipping...`));
}

const tg = new myDmx.TransitionGroup(group);

tg.on(myDmx.TimingEvents.TRIGGER, (tg) => console.log("tg: Triggered"));
tg.on(myDmx.TimingEvents.START, (tg) => console.log("tg: Started"));
tg.on(myDmx.TimingEvents.END, (tg) => console.timeEnd("timer"));
tg.on(myDmx.TimingEvents.PAUSED, (tg) => {
	console.log("Paused");
	console.time("Paused");
});
tg.on(myDmx.TimingEvents.RESUMED, (tg) => {
	console.log("Resumed");
	console.timeEnd("Paused");
});
tg.on(myDmx.TimingEvents.CANCELLED, (tg) => console.log("Cancelled"));

tg.trigger();
console.time("timer");

setTimeout(() => tg.pause(), 1500);
setTimeout(() => tg.resume(), 5000);

function updatePreview(num, val) {
	document.querySelectorAll(`[data-previewsChannel="${num}"]`).forEach((ch) => {
		ch.children[0].innerText = val;
		ch.children[0].style.height = `${val}%`;
	});
}
