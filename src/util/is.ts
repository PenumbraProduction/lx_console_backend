/* 
 *  Copyright (C) 2022  Daniel Farquharson
 *  
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, version 3 (GPLv3)
 *  
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *  
 *  See https://github.com/LordFarquhar/lx_console_app/blob/main/LICENSE an 
 *  implementation of GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
 */

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
