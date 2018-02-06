import { Injectable } from '@angular/core';
import { BaseModel } from './base-model';
import { BaseCollection } from './base-collection';
import { BaseConfig } from './base-config';
import { BaseOption } from './base-option';
import { BaseEvent } from './base-event';
import { BaseAuth } from './base-auth';
import { HttpClient } from "@angular/common/http";

@Injectable()
export class BaseService<T> implements BaseConfig {
    public debug: boolean = false;          // Development

    public baseUrl: string;                         // Example: http://[baseUrl]
    public url: string = "unkown";                  // Example: http://[baseUrl]/[url]
    public primaryKey: string = "id";               // Example: http://[baseUrl]/[url]/[primaryKey] : For use PUT, DELETE http method

    public perPage: number = 50;                    // Example: http://[baseUrl]/[url]?perPage=[?]
    public page: number = 1;                        // Example: http://[baseUrl]/[url]?perPage=[?]&page=[?]

    public authorization: boolean = false;              // Authorization

    private _auth: BaseAuth;                            // Base Auth
    private _option: BaseOption;                        // Base Option : HTTPClient GET Option
    private _model: BaseModel<T> = new BaseModel();     // Base Model  : Model
    private _http: HttpClient;                          // HTTPClient

    constructor(http, config?: BaseConfig, auth?: BaseAuth) {
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

    public setAuthorization(auth: BaseAuth) {
        this._auth = auth ? auth : null;
        this.authorization = auth ? true : false;
    }

    public setConfig(config) {
        this.debug = config.debug || this.debug;

        this.baseUrl = config.baseUrl || this.baseUrl;
        this.url = config.url || this.url;
        this.primaryKey = config.primaryKey || this.primaryKey;
        this._model.primaryKey = config.primaryKey || this.primaryKey;

        this.perPage = config.perPage || this.perPage;
        this.page = config.page || this.page;
    }

    public setOption(option) {
        this._option = option ? option : this._option;      // Load Option :: ** TODO next time can get by last option
    }

    /**
     * HTTPClient: GET
     * 
     * @param option Parameter get from RESTApi
     * @param event Event HTTPClient
     */
    public get(option?: BaseOption, event?: BaseEvent<BaseCollection<T>>) {
        /**
         * Url Header
         */
        let url = this.baseUrl + "/" + this.url;
        let header = {};
        let params = {};

        /**
         * Load Option|Event
         */
        this.setOption(option);
        //this.setEvent(event);

        /** 
         * Load Params
         */
        if (this._option) {
            if (this._option.search)    params["search"]    = this._option.search.toString();
            if (this._option.perPage)   params["perPage"]   = this._option.perPage.toString();
            if (this._option.page)      params["page"]      = this._option.page.toString();
            if (this._option.include)   params["include"]   = this._option.include.toString();

            if (this._option.values) {
                this._option.values.forEach(value => {
                    params[value.key]   = value.value.toString();
                });
            }
        }

        /** 
         * Authorization == true    => auth = logged()
         * Authorization == false   => auth = true
         * Authorization
         */
        
        let auth = this.authorization ? this._auth.logged() : true;
        if (this.authorization) {
            header['Authorization'] = "Bearer " + this._auth.token();
        } else {
            header['Authorization'] = "None"
        }


        if (auth) {
            if (event && typeof(event.before) == 'function') event.before(params);

            let http = this._http.get<BaseCollection<T>>(url, {
                headers: header,
                params: params
            }).subscribe(
                (res: BaseCollection<T>) => {
                    // Fill Data from server to model
                    var data = res;

                    this._model.items.current_page = data["current_page"];
                    this._model.items.data = data["data"];
                    this._model.items.first_page_url = data["first_page_url"];
                    this._model.items.from = data["from"];
                    this._model.items.last_page = data["last_page"];
                    this._model.items.last_page_url = data["last_page_url"];
                    this._model.items.next_page_url = data["next_page_url"];
                    this._model.items.path = data["path"];
                    this._model.items.per_page = data["per_page"];
                    this._model.items.prev_page_url = data["prev_page_url"];
                    this._model.items.to = data["to"];
                    this._model.items.total = data["total"];

                    data["data"].forEach((value: T) => {
                        this._model.items.push(value);
                    });
                    this._model.selectedIndex = 0;

                    if (event && typeof(event.success) == 'function') event.success(this._model.items);
                },
                e => {
                    if (event && typeof(event.error) == 'function') event.error(e);
                },
                () => {
                    if (event && typeof(event.completed) == 'function') event.completed();
                    http.unsubscribe();
                }
            );
        } else {
            if (event && typeof(event.error) == 'function') event.error("Access Denied");
        }
    }

    /**
     * Create new record to model.
     */
    public create(): T {
        this._model.selectedItem = <T>{};
        return this._model.selectedItem;
    }

    /**
     * Select record.
     * 
     * @param index Number index to select record.
     * @return Item selected.
     */
    public select(index: number): T {
        this._model.selectedIndex = index;
        return this._model.selectedItem;
    }

    /**
     * Save record to server.
     * 
     * @param event Event for operation save.
     */
    public save(event?: BaseEvent<BaseCollection<T>>): void {
        // Item
        let value = this._model.selectedItem;

        /**
         * Url Header
         */
        let url = this.baseUrl + "/" + this.url;
        let header = {};

       
        /** 
         * Authorization == true    => auth = logged()
         * Authorization == false   => auth = true
         * Authorization
         */
        let auth = this.authorization ? this._auth.logged() : true;
        if (this.authorization) {
            header['Authorization'] = "Bearer " + this._auth.token();
        } else {
            header['Authorization'] = "None"
        }

        if (auth) {
            // Check save NewRecord or Update
            if (!value[this._model.primaryKey]) {
                var http = this._http.post(url, value, { 
                    headers: header
                }).subscribe(
                    (res:T) => {
                        // Push new record to array
                        this._model.items.push(<T>res);

                        // Refrsh data
                        this._model.items = [...this._model.items];

                        // Raise Event Success.
                        if (event && typeof(event.success) == 'function') event.success(res);
                    },
                    e => {
                        // Raise Event Error.
                        if (event && typeof(event.error) == 'function') event.error(e);
                    },
                    () => {
                        // Raise Event Completed
                        if (event && typeof(event.completed) == 'function') event.completed();
                        http.unsubscribe();
                    }
                );
            } else {
                url = url + "/" + value[this._model.primaryKey];

                var http = this._http.put(url, value, { 
                    headers: header
                }).subscribe(
                    (res: T) => {
                        // Update Record from server.
                        this._model.items[this._model.selectedIndex] = <T>res;

                        // Refrsh data
                        this._model.items = [...this._model.items];

                        // Raise Event Success.
                        if (event && typeof(event.success) == 'function') event.success(res);
                    },
                    e => {
                        // Raise Event Error.
                        if (event && typeof(event.error) == 'function') event.error(e);
                    },
                    () => {
                        // Raise Event Completed
                        if (event && typeof(event.completed) == 'function') event.completed();
                        http.unsubscribe();
                    }
                );
            }
        } else {
            if (event && typeof(event.error) == 'function') event.error("Access Denied");
        }
    }


    /**
     * Delete record on server.
     * 
     * @param event Event for operation delete.
     */
    public delete(event?: BaseEvent<BaseCollection<T>>): void {
        // Item
        let value = this._model.selectedItem;

        /**
         * Url Header
         */
        let url = this.baseUrl + "/" + this.url + "/" + value[this._model.primaryKey];
        let header = {};

        /** 
         * Authorization == true    => auth = logged()
         * Authorization == false   => auth = true
         * Authorization
         */
        let auth = this.authorization ? this._auth.logged() : true;
        if (this.authorization) {
            header['Authorization'] = "Bearer " + this._auth.token();
        } else {
            header['Authorization'] = "None"
        }

        if (auth) {
            var http = this._http.delete(url, { 
                headers: header
            }).subscribe(
                res => {
                    // Delete Record from server.
                    this._model.items.splice(this._model.selectedIndex, 1);

                    // Refrsh data
                    this._model.items = [...this._model.items];

                    // Raise Event Success.
                    if (event && typeof(event.success) == 'function') event.success(res);
                },
                e => {
                    // Raise Event Error.
                    if (event && typeof(event.error) == 'function') event.error(e);
                },
                () => {
                    // Raise Event Completed
                    if (event && typeof(event.completed) == 'function') event.completed();
                    http.unsubscribe();
                }
            );
        } else {
            if (event && typeof(event.error) == 'function') event.error("Access Denied");
        }
    }

    /**
     * Binding Model
     */
    public model(): BaseModel<T> {
        return this._model;
    }
}