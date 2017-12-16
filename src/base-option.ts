export interface BaseOption {
    search?:string;
    take?: number;      // Limit record.
    offset?: number;    // Skip record.
    perPage?: number;   // Number record per display
    page?: number;      // Page
    values?: { key: string, value: string | number }[]; // Custom params
}