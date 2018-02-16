var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { BaseModel } from './base-model';
import { BaseAuth } from './base-auth';
var BaseService = /** @class */ (function () {
    function BaseService(http, config, auth) {
        this.debug = false; // Development
        this.url = "unkown"; // Example: http://[baseUrl]/[url]
        this.primaryKey = "id"; // Example: http://[baseUrl]/[url]/[primaryKey] : For use PUT, DELETE http method
        this.perPage = 50; // Example: http://[baseUrl]/[url]?perPage=[?]
        this.page = 1; // Example: http://[baseUrl]/[url]?perPage=[?]&page=[?]
        this.authorization = false; // Authorization
        this._model = new BaseModel(); // Base Model  : Model
        /**
         * Load HTTPClient
         */
        this._http = http;
        /**
         * Load Config
         */
        this.setConfig(config);
        /**
         * Load BaseAuth
         */
        this.setAuthorization(auth);
    }
    BaseService.prototype.setAuthorization = function (auth) {
        this._auth = auth ? auth : null;
        this.authorization = auth ? true : false;
    };
    BaseService.prototype.setConfig = function (config) {
        this.debug = config.debug || this.debug;
        this.baseUrl = config.baseUrl || this.baseUrl;
        this.url = config.url || this.url;
        this.primaryKey = config.primaryKey || this.primaryKey;
        this._model.primaryKey = config.primaryKey || this.primaryKey;
        this.perPage = config.perPage || this.perPage;
        this.page = config.page || this.page;
    };
    BaseService.prototype.setOption = function (option) {
        this._option = option ? option : this._option; // Load Option :: ** TODO next time can get by last option
    };
    /**
     * HTTPClient: GET
     *
     * @param option Parameter get from RESTApi
     * @param event Event HTTPClient
     */
    BaseService.prototype.get = function (option, event) {
        var _this = this;
        /**
         * Url Header
         */
        var url = this.baseUrl + "/" + this.url;
        var header = {};
        var params = {};
        /**
         * Load Option|Event
         */
        this.setOption(option);
        //this.setEvent(event);
        /**
         * Load Params
         */
        if (this._option) {
            if (this._option.search)
                params["search"] = this._option.search.toString();
            if (this._option.perPage)
                params["perPage"] = this._option.perPage.toString();
            if (this._option.page)
                params["page"] = this._option.page.toString();
            if (this._option.include)
                params["include"] = this._option.include.toString();
            if (this._option.values) {
                this._option.values.forEach(function (value) {
                    params[value.key] = value.value.toString();
                });
            }
        }
        /**
         * Authorization == true    => auth = logged()
         * Authorization == false   => auth = true
         * Authorization
         */
        var auth = this.authorization ? this._auth.logged() : true;
        if (this.authorization) {
            header['Authorization'] = "Bearer " + this._auth.token();
        }
        else {
            header['Authorization'] = "None";
        }
        if (auth) {
            if (event && typeof (event.before) == 'function')
                event.before(params);
            var http_1 = this._http.get(url, {
                headers: header,
                params: params
            }).subscribe(function (res) {
                _this._model.items = [];
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
                _this._model.selectedIndex = 0;
                if (event && typeof (event.success) == 'function')
                    event.success(_this._model.items);
            }, function (e) {
                if (event && typeof (event.error) == 'function')
                    event.error(e);
            }, function () {
                if (event && typeof (event.completed) == 'function')
                    event.completed();
                http_1.unsubscribe();
            });
        }
        else {
            if (event && typeof (event.error) == 'function')
                event.error("Access Denied");
        }
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
        // Item
        var value = this._model.selectedItem;
        /**
         * Url Header
         */
        var url = this.baseUrl + "/" + this.url;
        var header = {};
        /**
         * Authorization == true    => auth = logged()
         * Authorization == false   => auth = true
         * Authorization
         */
        var auth = this.authorization ? this._auth.logged() : true;
        if (this.authorization) {
            header['Authorization'] = "Bearer " + this._auth.token();
        }
        else {
            header['Authorization'] = "None";
        }
        if (auth) {
            // Check save NewRecord or Update
            if (!value[this._model.primaryKey]) {
                var http = this._http.post(url, value, {
                    headers: header
                }).subscribe(function (res) {
                    // Push new record to array
                    _this._model.items.push(res);
                    // Refrsh data
                    _this._model.items = _this._model.items.slice();
                    // Raise Event Success.
                    if (event && typeof (event.success) == 'function')
                        event.success(res);
                }, function (e) {
                    // Raise Event Error.
                    if (event && typeof (event.error) == 'function')
                        event.error(e);
                }, function () {
                    // Raise Event Completed
                    if (event && typeof (event.completed) == 'function')
                        event.completed();
                    http.unsubscribe();
                });
            }
            else {
                url = url + "/" + value[this._model.primaryKey];
                var http = this._http.put(url, value, {
                    headers: header
                }).subscribe(function (res) {
                    // Update Record from server.
                    _this._model.items[_this._model.selectedIndex] = res;
                    // Refrsh data
                    _this._model.items = _this._model.items.slice();
                    // Raise Event Success.
                    if (event && typeof (event.success) == 'function')
                        event.success(res);
                }, function (e) {
                    // Raise Event Error.
                    if (event && typeof (event.error) == 'function')
                        event.error(e);
                }, function () {
                    // Raise Event Completed
                    if (event && typeof (event.completed) == 'function')
                        event.completed();
                    http.unsubscribe();
                });
            }
        }
        else {
            if (event && typeof (event.error) == 'function')
                event.error("Access Denied");
        }
    };
    /**
     * Delete record on server.
     *
     * @param event Event for operation delete.
     */
    BaseService.prototype.delete = function (event) {
        var _this = this;
        // Item
        var value = this._model.selectedItem;
        /**
         * Url Header
         */
        var url = this.baseUrl + "/" + this.url + "/" + value[this._model.primaryKey];
        var header = {};
        /**
         * Authorization == true    => auth = logged()
         * Authorization == false   => auth = true
         * Authorization
         */
        var auth = this.authorization ? this._auth.logged() : true;
        if (this.authorization) {
            header['Authorization'] = "Bearer " + this._auth.token();
        }
        else {
            header['Authorization'] = "None";
        }
        if (auth) {
            var http = this._http.delete(url, {
                headers: header
            }).subscribe(function (res) {
                // Delete Record from server.
                _this._model.items.splice(_this._model.selectedIndex, 1);
                // Refrsh data
                _this._model.items = _this._model.items.slice();
                // Raise Event Success.
                if (event && typeof (event.success) == 'function')
                    event.success(res);
            }, function (e) {
                // Raise Event Error.
                if (event && typeof (event.error) == 'function')
                    event.error(e);
            }, function () {
                // Raise Event Completed
                if (event && typeof (event.completed) == 'function')
                    event.completed();
                http.unsubscribe();
            });
        }
        else {
            if (event && typeof (event.error) == 'function')
                event.error("Access Denied");
        }
    };
    /**
     * Binding Model
     */
    BaseService.prototype.model = function () {
        return this._model;
    };
    BaseService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Object, Object, BaseAuth])
    ], BaseService);
    return BaseService;
}());
export { BaseService };
//# sourceMappingURL=base-service.js.map