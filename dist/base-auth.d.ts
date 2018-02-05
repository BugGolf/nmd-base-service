export declare class BaseAuth {
    authorization_url: string;
    authorization_url_login: string;
    authorization_url_logout: string;
    authorization_url_token: string;
    private X_REFRESH_TOKEN;
    private X_ACCESS_TOKEN;
    private REFRESH_TOKEN;
    private ACCESS_TOKEN;
    private http;
    constructor(http: any);
    private parseJwt(token);
    private validJwt(token);
    private clearToken();
    private getToken();
    login(userId: string, passId: string, ...values: {
        key: string;
        value: string;
    }[]): Promise<boolean>;
    logout(): Promise<boolean>;
    logged(): boolean;
    payloads(): any;
    token(): string;
}
