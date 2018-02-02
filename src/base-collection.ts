export class BaseCollection<T> extends Array<T>
{
    // Output from Laravel paginate

    public current_page?:number;
    public data?: T[];          
    public first_page_url?: string;
    public from?: number;
    public last_page?: number;
    public last_page_url?: string;
    public next_page_url?: string;
    public path?: string;
    public per_page?: number;
    public prev_page_url?: string;
    public to?: number;
    public total?: number;
}