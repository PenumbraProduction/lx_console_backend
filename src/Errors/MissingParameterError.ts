export class MissingParameterError extends Error {  
	constructor(paramName: string, context: string) {
		const message = `Expected parameter '${paramName}' as '${context}'`;
        super(message);
		// Ensure the name of this error is the same as the class name
		this.name = this.constructor.name;
		// This clips the constructor invocation from the stack trace, make the stack trace nicer
		Error.captureStackTrace(this, this.constructor);
	}
}