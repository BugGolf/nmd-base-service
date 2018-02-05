// Global
export class BaseError {
    constructor (...e:any[]) {
        Error.apply(this, e);
    }
}

//
// HTTPClient
//
export class HttpBadRequest {
    constructor () {
        Error.apply(this, [400, 'Bad Request']);
    }
}
export class HttpUnauthorized {
    constructor () {
        Error.apply(this, [401, 'Unauthorized']);
    }
}
export class HttpPaymentRequired {
    constructor () {
        Error.apply(this, [402, 'Payment Required']);
    }
}
export class HttpForbidden {
    constructor () {
        Error.apply(this, [403, 'Forbidden']);
    }
}
export class HttpNotFound {
    constructor () {
        Error.apply(this, [404, 'Not Found']);
    }
}