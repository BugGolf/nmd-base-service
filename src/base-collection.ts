export class BaseCollection<T> extends Array<T>
{
    public totals?: number = 0;         // Total Records on server.
    public pages?: number[] = [];       // Total Pages on server.
    public currentPage?: number = 0;    // Current page
    public lastPage?: number = 0;       // Last page number
    public perPage?: number = 0;        // Display record per page.
    public Results?: T[];
}