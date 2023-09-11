class BaseError extends Error {
    code: string;
    statusCode: number;
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
        this.code = this.constructor.name;
        this.statusCode = 400;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class RequestError extends BaseError {
    constructor(message: string) {
        super(message)
        this.statusCode = 400
    }
}

export class UnauthorizedError extends BaseError {
    constructor(message: string) {
        super(message)
        this.statusCode = 401
    }
}