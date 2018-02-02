import { BaseModel } from './base-model';
import { HttpParams } from "@angular/common/http";
var BaseService = /** @class */ (function () {
    function BaseService(http) {
        var _this = this;
        this.primaryKey = "id";
        this.url = "";
        this.perPage = 50;
        this.page = 1;
        this.config = {
            baseUrl: "",
            debug: true
        };
        this._model = new BaseModel();
        /**
         * Load HTTPClient from Angular Injection
         */
        this._http = http;
        /**
         * Setup primary key to model object
         */
        this._model.primaryKey = this.primaryKey;
        /**
         * Setup dafault function for get RESTful
         */
        this._event = {
            /**
             * Before Event
             */
            before: function (params) {
                /** Check DEBUG is true */
                if (_this.config.debug == true) {
                    console.log(_this.url + " => Event Before: Params ", params);
                }
            },
            success: function (result) {
                /** Check DEBUG is true */
                if (_this.config.debug == true) {
                    console.log(_this.url + " => Event Success: Receive data", result);
                }
            },
            error: function (e) {
                /** Check DEBUG is true */
                if (_this.config.debug == true) {
                    console.log(_this.url + " => Event Error: Message ", e);
                }
            },
            completed: function () {
                /** Check DEBUG is true */
                if (_this.config.debug == true) {
                    console.log(_this.url + " => Completed.");
                }
            },
        };
    }
    /**
     * Get from server.
     *
     * @param option Option for query on server.
     * @param event Event for operation get.
     */
    BaseService.prototype.get = function (option, event) {
        var _this = this;
        this._option = option;
        var url = this.config.baseUrl + "/" + this.url;
        var Params = new HttpParams();
        // Config search
        if (this._option && this._option.search)
            Params = Params.append("search", this._option.search.toString());
        // Config current page
        if (this._option && this._option.page)
            Params = Params.append("page", this._option.page.toString());
        else
            Params = Params.append("perpage", this.page.toString());
        // Config per page
        if (this._option && this._option.perPage)
            Params = Params.append("perpage", this._option.perPage.toString());
        else
            Params = Params.append("perpage", this.perPage.toString());
        // Config each values
        if (this._option && this._option.values) {
            this._option.values.forEach(function (field) {
                Params = Params.append(field.key, field.value.toString());
            });
        }
        // Raise event Before
        if (event && event.before)
            event.before(Params);
        var http = this._http.get(url, { params: Params }).subscribe(function (res) {
            // Fill Data from server to model
            var data = res;
            _this._model.items.current_page = data["current_page"];
            _this._model.items.data = data["data"];
            _this._model.items.first_page_url = data["first_page_url"];
            _this._model.items.from = data["from"];
            _this._model.items.last_page = data["last_page"];
            _this._model.items.last_page_url = data["last_page_url"];
            _this._model.items.next_page_url = data["next_page_url"];
            _this._model.items.path = data["path"];
            _this._model.items.per_page = data["per_page"];
            _this._model.items.prev_page_url = data["prev_page_url"];
            _this._model.items.to = data["to"];
            _this._model.items.total = data["total"];
            data["data"].forEach(function (value) {
                _this._model.items.push(value);
            });
            // Raise event Success
            if (event && event.success)
                event.success(_this._model.items);
        }, function (e) {
            // Raise event Error
            if (event && event.error)
                event.error(e);
        }, function () {
            // Raise event Completed
            if (event && event.completed)
                event.completed();
            http.unsubscribe();
        });
    };
    /**
     * Create new record to model.
     */
    BaseService.prototype.create = function () {
        this._model.selectedItem = {};
        return this._model.selectedItem;
    };
    /**
     * Select record.
     *
     * @param index Number index to select record.
     * @return Item selected.
     */
    BaseService.prototype.select = function (index) {
        this._model.selectedIndex = index;
        return this._model.selectedItem;
    };
    /**
     * Save record to server.
     *
     * @param event Event for operation save.
     */
    BaseService.prototype.save = function (event) {
        var _this = this;
        // Get record
        var value = this._model.selectedItem;
        // Check save NewRecord or Update
        if (!value[this._model.primaryKey]) {
            // New record. Bacause record not have primary key.
            var url = this.config.baseUrl + "/" + this.url;
            var http = this._http.post(url, value).subscribe(function (res) {
                // Push new record to array
                _this._model.items.push(res);
                // Refrsh data
                _this._model.items = _this._model.items.slice();
                // Raise Event Success.
                if (event && event.success)
                    event.success(res);
            }, function (e) {
                // Raise Event Error.
                if (event && event.error)
                    event.error(e);
            }, function () {
                // Raise Event Completed
                if (event && event.completed)
                    event.completed();
                http.unsubscribe();
            });
        }
        else {
            var url = this.config.baseUrl + "/" + this.url + "/" + value[this._model.primaryKey];
            var http = this._http.post(url, value).subscribe(function (res) {
                // Update Record from server.
                _this._model.items[_this._model.selectedIndex] = res;
                // Refrsh data
                _this._model.items = _this._model.items.slice();
                // Raise Event Success.
                if (event && event.success)
                    event.success(res);
            }, function (e) {
                // Raise Event Error.
                if (event && event.error)
                    event.error(e);
            }, function () {
                // Raise Event Completed
                if (event && event.completed)
                    event.completed();
                http.unsubscribe();
            });
        }
    };
    /**
     * Delete record on server.
     *
     * @param event Event for operation delete.
     */
    BaseService.prototype.delete = function (event) {
    };
    /**
     * Binding Model
     */
    BaseService.prototype.getModel = function () {
        return this._model;
    };
    return BaseService;
}());
export { BaseService };
//# sourceMappingURL=base-service.js.map