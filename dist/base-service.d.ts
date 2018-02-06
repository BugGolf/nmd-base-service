import { BaseModel } from './base-model';
import { BaseCollection } from './base-collection';
import { BaseConfig } from './base-config';
import { BaseOption } from './base-option';
import { BaseEvent } from './base-event';
import { BaseAuth } from './base-auth';
export declare class BaseService<T> implements BaseConfig {
    debug: boolean;
    baseUrl: string;
    url: string;
    primaryKey: string;
    perPage: number;
    page: number;
    authorization: boolean;
    private _auth;
    private _option;
    private _model;
    private _http;
    constructor(http: any, config?: BaseConfig, auth?: BaseAuth);
    setAuthorization(auth: BaseAuth): void;
    setConfig(config: any): void;
    setOption(option: any): void;
    /**
     * HTTPClient: GET
     *
     * @param option Parameter get from RESTApi
     * @param event Event HTTPClient
     */
    get(option?: BaseOption, event?: BaseEvent<BaseCollection<T>>): void;
    /**
     * Create new record to model.
     */
    create(): T;
    /**
     * Select record.
     *
     * @param index Number index to select record.
     * @return Item selected.
     */
    select(index: number): T;
    /**
     * Save record to server.
     *
     * @param event Event for operation save.
     */
    save(event?: BaseEvent<BaseCollection<T>>): void;
    /**
     * Delete record on server.
     *
     * @param event Event for operation delete.
     */
    delete(event?: BaseEvent<BaseCollection<T>>): void;
    /**
     * Binding Model
     */
    model(): BaseModel<T>;
}
