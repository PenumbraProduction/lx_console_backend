export function isNumber(d: any): boolean {
	if (isNaN(d)) return false;
	if (typeof d == "number") return true;
	return !isNaN(parseInt(d));
}

// export function deepEqual(object1: object, object2: object) {
// 	const keys1 = Object.keys(object1);
// 	const keys2 = Object.keys(object2);
// 	if (keys1.length !== keys2.length) {
// 		return false;
// 	}
// 	for (const key of keys1) {
// 		const val1 = object1[key];
// 		const val2 = object2[key];
// 		const areObjects = isObject(val1) && isObject(val2);
// 		if ((areObjects && !deepEqual(val1, val2)) || (!areObjects && val1 !== val2)) {
// 			return false;
// 		}
// 	}
// 	return true;
// }
