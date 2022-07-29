import { isNumber } from "../util";

export const ModifierKey = {
	CONTROL: "Control",
	SHIFT: "Shift",
	ALT: "Alt"
};

export const MetaKey = {
	UNIDENTIFIED: "Unidentified",
	META: "Meta"
};

export const ArrowKey = {
	ARROW_LEFT: "ArrowLeft",
	ARROW_RIGHT: "ArrowRight",
	ARROW_UP: "ArrowUp",
	ARROW_DOWN: "ArrowDown"
};

export const ControlKey = {
	ENTER: "Enter",
	BACKSPACE: "Backspace",
	DELETE: "Delete",
	ESCAPE: "Escape",
	TAB: "Tab",
	PAGE_UP: "PageUp",
	PAGE_DOWN: "PageDown"
};

export const NumericalKey = {
	ZERO: "0",
	ONE: "1",
	TWO: "2",
	THREE: "3",
	FOUR: "4",
	FIVE: "5",
	SIX: "6",
	SEVEN: "7",
	EIGHT: "8",
	NINE: "9"
};

export const AlphabeticalKey = {
	A: "a",
	B: "b",
	C: "c",
	D: "d",
	E: "e",
	F: "f",
	G: "g",
	H: "h",
	I: "i",
	J: "j",
	K: "k",
	L: "l",
	M: "m",
	N: "n",
	O: "o",
	P: "p",
	Q: "q",
	R: "r",
	S: "s",
	T: "t",
	U: "u",
	V: "v",
	W: "w",
	X: "x",
	Y: "y",
	Z: "z"
};

export const Key = { ...AlphabeticalKey, ...NumericalKey, ...ControlKey, ...ArrowKey, ...ModifierKey, ...MetaKey };
export type Key = typeof Key;

export class CommandLine {
	tokens: any[];
	tokenParts: any[];
	modifierKeys: Set<string>;

	constructor() {
		this.tokens = [];
		this.tokenParts = [];

		this.modifierKeys = new Set();
	}

	addToken(token: string) {
		const tokenFromParts = this.buildTokenFromParts();
		if (tokenFromParts) this.tokens.push(tokenFromParts);
		if (token) this.tokens.push(token);
	}

	addTokenPart(tokenPart: string) {
		if (tokenPart) this.tokenParts.push(tokenPart);
	}

	buildTokenFromParts(): string {
		const token = this.tokenParts.join("");
		this.tokenParts = [];
		return token;
	}

	parseSelectionString(tokens: string[]) {
		const channels = new Set();
		let i = 0;

		const handleTokenPart = (): void => {
			if (i >= tokens.length) return; // console.log("passed token length");
			const token = tokens[i];
			if (isNumber(token)) {
				channels.add(parseInt(token));
				i += 1;
				return handleTokenPart();
			}

			if (token == "-") {
				channels.delete(parseInt(tokens[i + 1]));
				i += 2;
				return handleTokenPart();
			}

			if (token == "+") {
				channels.add(parseInt(tokens[i + 1]));
				i += 2;
				return handleTokenPart();
			}

			if (token == ">") {
				if (parseInt(tokens[i + 1]) < parseInt(tokens[i - 1])) {
					for (let j = parseInt(tokens[i + 1]); j <= parseInt(tokens[i - 1]); j++) {
						if (tokens[i - 2] && tokens[i - 2] == "-") channels.delete(j);
						else channels.add(j);
					}
				} else {
					for (let j = parseInt(tokens[i - 1]); j <= parseInt(tokens[i + 1]); j++) {
						if (tokens[i - 2] && tokens[i - 2] == "-") channels.delete(j);
						else channels.add(j);
					}
				}

				i += 2;
				return handleTokenPart();
			}

			return;
		};
		handleTokenPart();

		return channels;
	}
}
