export interface BaseEvent<T> {
    /**
     * Before Event
     * 
     */
    before?(params: any): void;

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