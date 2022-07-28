export class OverlapError extends Error {
	constructor(message: string) {
		super(message);
		// Ensure the name of this error is the same as the class name
		this.name = this.constructor.name;
		// This clips the constructor invocation from the stack trace, make the stack trace nicer
		Error.captureStackTrace(this, this.constructor);
	}
}

export class MapOverlapError extends OverlapError {
	constructor(message: string) {
		super(message);
	}
}

export class DmxRangeOverlapError extends OverlapError {
	constructor(message: string) {
		super(message);
	}
}