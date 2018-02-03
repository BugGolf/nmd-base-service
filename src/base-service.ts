
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

    private _event: BaseEvent<BaseCollection<T>>;
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
    public get(option?: BaseOption, event?: BaseEvent<BaseCollection<T>>) {
        this._option = option;

        let url = this.config.baseUrl + "/" + this.url;

        // Raise event Before
        if (event && event.before) event.before(this._option);
        var http = this._http.get<BaseCollection<T>>(url, { params: <{}>this._option }).subscribe(
            (res:BaseCollection<T>) => {
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
                
                data["data"].forEach( (value:T) => {
                    this._model.items.push(value);
                });

                // Raise event Success
                if (event && event.success) event.success(this._model.items);
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
    public save(event?: BaseEvent<BaseCollection<T>>): void {
        // Get record
        var value = this._model.selectedItem;

        // Check save NewRecord or Update
        if(!value[this._model.primaryKey]) {
            // New record. Bacause record not have primary key.
            var url = this.config.baseUrl + "/" + this.url;

            var http = this._http.post(url, value).subscribe(
                res => {
                    // Push new record to array
                    this._model.items.push(<T>res);

                    // Refrsh data
                    this._model.items = [...this._model.items];

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

            var http = this._http.put(url, value).subscribe(
                res => {
                    // Update Record from server.
                    this._model.items[this._model.selectedIndex] = <T>res;

                    // Refrsh data
                    this._model.items = [...this._model.items];

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
    public delete(event?: BaseEvent<BaseCollection<T>>): void {


    }

    /**
     * Binding Model
     */
    public getModel(): BaseModel<T> {
        return this._model;
    }
}