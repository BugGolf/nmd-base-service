export interface BaseOption {
    search?: string;
    take?: number;
    offset?: number;
    perPage?: number;
    page?: number;
    values?: {
        key: string;
        value: string | number;
    }[];
}
