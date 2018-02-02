import { HttpParams } from "@angular/common/http";


export interface BaseEvent<T> {
    /**
     * Before Event
     * 
     */
    before?(params: HttpParams): void;

    /**
     * Success Event
     */
    success?(result:any): void;

    /**
     * Error Event
     */
    error?(e): void;

    /**
     * Completed Event
     */
    completed?(): void;
}