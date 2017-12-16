"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var BaseCollection = /** @class */ (function (_super) {
    __extends(BaseCollection, _super);
    function BaseCollection() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.totals = 0; // Total Records on server.
        _this.pages = []; // Total Pages on server.
        _this.currentPage = 0; // Current page
        _this.lastPage = 0; // Last page number
        _this.perPage = 0; // Display record per page.
        return _this;
    }
    return BaseCollection;
}(Array));
exports.BaseCollection = BaseCollection;
//# sourceMappingURL=base-collection.js.map