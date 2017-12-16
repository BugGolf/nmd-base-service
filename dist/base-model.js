"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel = /** @class */ (function () {
    function BaseModel() {
        this._primary = "id";
        this._items = [];
        this._item = {};
    }
    Object.defineProperty(BaseModel.prototype, "Items", {
        /**
         * Return items.
         */
        get: function () {
            return this._items;
        },
        /**
         * Set Items.
         */
        set: function (value) {
            this._items = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseModel.prototype, "selectedItem", {
        /**
         * Return selectedItem.
         */
        get: function () {
            return this._item;
        },
        /**
         * Select Item by item.
         *
         * @param item Item selected.
         */
        set: function (item) {
            this._item = item;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseModel.prototype, "selectedIndex", {
        /**
         * Return selectedIndex
         */
        get: function () {
            return this._items.indexOf(this._item, 0);
        },
        /**
         * Select Item by index.
         *
         * @param index Number index for item to select it.
         */
        set: function (index) {
            this._item = this._items[index];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseModel.prototype, "primaryKey", {
        /**
         * Return Primary field name.
         */
        get: function () {
            return this._primary;
        },
        /**
         * Set Primary field name.
         *
         * @param value Field primary key name.
         */
        set: function (value) {
            this._primary = value;
        },
        enumerable: true,
        configurable: true
    });
    return BaseModel;
}());
exports.BaseModel = BaseModel;
//# sourceMappingURL=base-model.js.map