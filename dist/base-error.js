// Global
var BaseError = /** @class */ (function () {
    function BaseError() {
        var e = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            e[_i] = arguments[_i];
        }
        Error.apply(this, e);
    }
    return BaseError;
}());
export { BaseError };
//
// HTTPClient
//
var HttpBadRequest = /** @class */ (function () {
    function HttpBadRequest() {
        Error.apply(this, [400, 'Bad Request']);
    }
    return HttpBadRequest;
}());
export { HttpBadRequest };
var HttpUnauthorized = /** @class */ (function () {
    function HttpUnauthorized() {
        Error.apply(this, [401, 'Unauthorized']);
    }
    return HttpUnauthorized;
}());
export { HttpUnauthorized };
var HttpPaymentRequired = /** @class */ (function () {
    function HttpPaymentRequired() {
        Error.apply(this, [402, 'Payment Required']);
    }
    return HttpPaymentRequired;
}());
export { HttpPaymentRequired };
var HttpForbidden = /** @class */ (function () {
    function HttpForbidden() {
        Error.apply(this, [403, 'Forbidden']);
    }
    return HttpForbidden;
}());
export { HttpForbidden };
var HttpNotFound = /** @class */ (function () {
    function HttpNotFound() {
        Error.apply(this, [404, 'Not Found']);
    }
    return HttpNotFound;
}());
export { HttpNotFound };
//# sourceMappingURL=base-error.js.map