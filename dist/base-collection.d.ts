export declare class BaseCollection<T> extends Array<T> {
    totals?: number;
    pages?: number[];
    currentPage?: number;
    lastPage?: number;
    perPage?: number;
    Results?: T[];
}
