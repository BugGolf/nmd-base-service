export interface BaseOption {
    search?:string;
    page?: number;      
    perPage?: number;
    include?:string;
    values?: { key: string, value: string }[]; // Custom params
}