export interface BaseOption {
    search?: string;
    page?: number;
    perPage?: number;
    values?: {
        key: string;
        value: string | number;
    }[];
}
