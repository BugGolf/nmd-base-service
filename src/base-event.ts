import { HttpParams } from "@angular/common/http";


export interface BaseEvent {
    /**
     * Before Event
     * 
     */
    before?(params: HttpParams): void;

    /**
     * Success Event
     */
    success?(result): void;

    /**
     * Error Event
     */
    error?(e): void;

    /**
     * Completed Event
     */
    completed(): void;
}