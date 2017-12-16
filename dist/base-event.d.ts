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
    success?(result: any): void;
    /**
     * Error Event
     */
    error?(e: any): void;
    /**
     * Completed Event
     */
    completed(): void;
}