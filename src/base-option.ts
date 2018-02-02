export interface BaseOption {
    search?:string;
    page?: number;      // Limit record.
    perPage?: number;      // Limit record.
    values?: { key: string, value: string | number }[]; // Custom params
}