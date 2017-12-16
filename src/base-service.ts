
import { BaseModel } from './base-model';
import { BaseCollection } from './base-collection';
import { BaseConfig } from './base-config';
import { BaseOption } from './base-option';
import { BaseEvent } from './base-event';
import { HttpClient, HttpParams } from "@angular/common/http";

export class BaseService<T>
{
    protected primaryKey: string = "id";
    protected url: string = "";
    protected perPage: number = 50;
    protected page: number = 1;

    protected config: BaseConfig = {
        baseUrl: "",
        debug: true
    }

    private _event: BaseEvent;
    private _option: BaseOption;
    private _model: BaseModel<T> = new BaseModel();
    private _http: HttpClient;

    constructor(http) {
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
            before: (params) => {
                /** Check DEBUG is true */
                if (this.config.debug == true) {
                    console.log(this.url + " => Event Before: Params ", params);
                }
            },
            success: (result) => {
                /** Check DEBUG is true */
                if (this.config.debug == true) {
                    console.log(this.url + " => Event Success: Receive data", result);
                }
            },
            error: (e) => {
                /** Check DEBUG is true */
                if (this.config.debug == true) {
                    console.log(this.url + " => Event Error: Message ", e);
                }
            },
            completed: () => {
                /** Check DEBUG is true */
                if (this.config.debug == true) {
                    console.log(this.url + " => Completed.");
                }
            },
        }
    }


    /**
     * Get from server.
     * 
     * @param option Option for query on server.
     * @param event Event for operation get.
     */
    public get(option?: BaseOption, event?: BaseEvent) {
        this._option = option;

        var url = this.config.baseUrl + "/" + this.url;
        var params = new HttpParams();

        // Config search
        if (this._option && this._option.page) params.append("search", this._option.search.toString());

        // Config current page
        if (this._option && this._option.page) params.append("page", this._option.page.toString());
        else params.append("perpage", this.page.toString());
        // Config per page
        if (this._option && this._option.perPage) params.append("perpage", this._option.perPage.toString());
        else params.append("perpage", this.perPage.toString());

        // Config each values
        if (this._option && this._option.values) {
            this._option.values.forEach(field => {
                params.append(field.key, field.value.toString());
            });
        }

        // Raise event Before
        if (event && event.before) event.before(params);
        var http = this._http.get(url, { params }).subscribe(
            res => {
                // Fill Data from server to model
                var data = <BaseCollection<T>>res;
                this._model.Items = data.Results; // Receive data to default
                this._model.Items = data; // Receive data

                // Raise event Success
                if (event && event.success) event.success(this._model.Items);
            },
            e => {
                // Raise event Error
                if (event && event.error) event.error(e);
            },
            () => {
                // Raise event Completed
                if (event && event.completed) event.completed();
                http.unsubscribe();
            }
        );
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
    public save(event?: BaseEvent): void {
        // Get record
        var value = this._model.selectedItem;

        // Check save NewRecord or Update
        if(!value[this._model.primaryKey]) {
            // New record. Bacause record not have primary key.
            var url = this.config.baseUrl + "/" + this.url;

            var http = this._http.post(url, value).subscribe(
                res => {
                    // Push new record to array
                    this._model.Items.push(<T>res);

                    // Refrsh data
                    this._model.Items = [...this._model.Items];

                    // Raise Event Success.
                    if(event && event.success) event.success(<T>res);
                },
                e => {
                    // Raise Event Error.
                    if(event && event.error) event.error(e);
                },
                () => {
                    // Raise Event Completed
                    if (event && event.completed) event.completed();
                    http.unsubscribe();
                }
            );
        } else {
            var url = this.config.baseUrl + "/" + this.url + "/" + value[this._model.primaryKey];

            var http = this._http.post(url, value).subscribe(
                res => {
                    // Update Record from server.
                    this._model.Items[this._model.selectedIndex] = <T>res;

                    // Refrsh data
                    this._model.Items = [...this._model.Items];

                    // Raise Event Success.
                    if(event && event.success) event.success(<T>res);
                },
                e => {
                    // Raise Event Error.
                    if(event && event.error) event.error(e);
                },
                () => {
                    // Raise Event Completed
                    if (event && event.completed) event.completed();
                    http.unsubscribe();
                }
            );
        }
    }


    /**
     * Delete record on server.
     * 
     * @param event Event for operation delete.
     */
    public delete(event?: BaseEvent): void {


    }

    /**
     * Binding Model
     */
    public getModel(): BaseModel<T> {
        return this._model;
    }
}