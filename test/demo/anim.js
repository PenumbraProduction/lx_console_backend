const {Transition, TransitionGroup, Anim} = require("../out/models/Transition");

const t1 = new Transition(0, 50, 5 * 1000, 0 * 1000);
const t2 = new Transition(0, 100, 5 * 1000, 2 * 1000);
const t3 = new Transition(0, 20, 2 * 1000, 0 * 1000);
const t4 = new Transition(80, 90, 3 * 1000, 2 * 1000);

const tg1 = new TransitionGroup([t1, t2, t3, t4])

const t5 = new Transition(50, 80, 1 * 1000, 0 * 1000);
const t6 = new Transition(100, 0, 6 * 1000, 1 * 1000);
const t7 = new Transition(20, 80, 2 * 1000, 5 * 1000);
const t8 = new Transition(90, 30, 3 * 1000, 2 * 1000);

const tg2 = new TransitionGroup([t5, t6, t7, t8], 5000)

const anim = new Anim([tg1, tg2]);

anim.trigger();