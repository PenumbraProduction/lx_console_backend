export class MissingPropertyError extends Error {
    object: Object;
    
	constructor(obj: Object, paramName: string) {
		const message = `Expected Property '${paramName}' on object '${obj.constructor}' but none exists`;
        super(message);
        this.object = obj
		// Ensure the name of this error is the same as the class name
		this.name = this.constructor.name;
		// This clips the constructor invocation from the stack trace, make the stack trace nicer
		Error.captureStackTrace(this, this.constructor);
	}
}