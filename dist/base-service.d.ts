import { BaseModel } from './base-model';
import { BaseConfig } from './base-config';
import { BaseOption } from './base-option';
import { BaseEvent } from './base-event';
export declare class BaseService<T> {
    protected primaryKey: string;
    protected url: string;
    protected perPage: number;
    protected page: number;
    protected config: BaseConfig;
    private _event;
    private _option;
    private _model;
    private _http;
    constructor(http: any);
    /**
     * Get from server.
     *
     * @param option Option for query on server.
     * @param event Event for operation get.
     */
    get(option?: BaseOption, event?: BaseEvent): void;
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
    save(event?: BaseEvent): void;
    /**
     * Delete record on server.
     *
     * @param event Event for operation delete.
     */
    delete(event?: BaseEvent): void;
    /**
     * Binding Model
     */
    getModel(): BaseModel<T>;
}
