import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BaseConfig } from './base-config';

export class BaseAuth {
    public authorization_url: string          = '';                                          // Authorization : Example http://[authorization_url]
    public authorization_url_login: string    = '/login';           // Authorization : Example http://[authorization_url]/[login]   Get Refresh Token
    public authorization_url_logout: string   = '/logout';          // Authorization : Example http://[authorization_url]/[logout]  Clear Token
    public authorization_url_token: string    = '/accessToken';     // Authorization : Example http://[authorization_url]/[token]   Get Access Token

    private X_REFRESH_TOKEN:string = 'X-REFRESH-TOKEN';
    private X_ACCESS_TOKEN:string = 'X-ACCESS-TOKEN';

    private REFRESH_TOKEN: string;
    private ACCESS_TOKEN: string;

    private http:HttpClient;

    constructor(http) {
        this.http = http;

        this.REFRESH_TOKEN = localStorage.getItem(this.X_REFRESH_TOKEN);
        this.ACCESS_TOKEN = localStorage.getItem(this.X_ACCESS_TOKEN);
    }

    private parseJwt(token: string) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse(window.atob(base64));
    }

    private validJwt(token: string) {
        let payloads = this.parseJwt(token);
        //console.log(payloads);

        return parseInt(payloads['exp']) > ((new Date).getTime() / 1000);
    }

    private clearToken() {
        localStorage.removeItem(this.X_ACCESS_TOKEN);
        localStorage.removeItem(this.X_REFRESH_TOKEN);
    }

    private getToken() {
        let token = localStorage.getItem(this.X_REFRESH_TOKEN) || null;

        this.http.get(this.authorization_url + this.authorization_url_token, {
            headers: new HttpHeaders().set(this.X_REFRESH_TOKEN, token),
            responseType: 'json'
        }).subscribe(
            (res) => {
                if (res["accessToken"]) {
                    let accessToken = res["accessToken"];
                    localStorage.setItem(this.X_ACCESS_TOKEN, accessToken);
                } else {
                    this.clearToken();
                }
            },
            (e) => {
                this.clearToken();
            }
        );
    }

    public login(userId: string, passId: string, ...values:{key:string, value:string}[]): Promise<boolean> {
        if (userId && passId) {
            return new Promise<boolean>((resolve) => {
                // Basic Authorization
                let authen = 'Basic ' + btoa(userId + ":" + passId);

                // Each for HttpParams
                let params = new HttpParams();
                values.forEach(e => { 
                    if(e.value != null) params = params.append(e.key, e.value); 
                });

                this.http.get(this.authorization_url + this.authorization_url_login, {
                    headers: new HttpHeaders().set('Authorization', authen),
                    params: params,
                    responseType: "json"
                }).subscribe(
                    (res) => {
                        if (res["accessToken"] && res["refreshToken"]) {
                            let accessToken = res["accessToken"];
                            let refreshToken = res["refreshToken"];

                            localStorage.setItem(this.X_ACCESS_TOKEN, accessToken);
                            localStorage.setItem(this.X_REFRESH_TOKEN, refreshToken);

                            resolve(true);
                        } else {
                            resolve(false);
                        }
                    },
                    (e) => { resolve(false) },
                );
            });
        } else {
            return new Promise<boolean>((resolve) => resolve(false));
        }
    }

    public logout():Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            this.http.get(this.authorization_url + this.authorization_url_logout, {
                headers: new HttpHeaders().set(this.X_REFRESH_TOKEN, this.REFRESH_TOKEN),
                responseType: 'text'
            }).subscribe(
                res => { 
                    this.clearToken();

                    resolve(true); 
                },
                e => { resolve(false); },
                () => { resolve(false); }
            );
        });
    }

    public logged() {
        // ตรวจสอบ Access Token จาก localStorage
        let token = localStorage.getItem(this.X_ACCESS_TOKEN) || null;

        if (token) {
            // ถ้าพบ Access Token นั้นหมายความว่าเข้าใช้งานระบบแล้ว
            let validToken = this.validJwt(token);

            // ตรวจสอบ Access Token ว่าหมดอายุหรือยัง?
            if (!validToken) {
                // หากหมดอายุแล้วจะต้องขอใหม่
                this.getToken();
            }
            return true;

        } else {
            return false;
        }
    }

    public payloads() {
        let token = localStorage.getItem(this.X_ACCESS_TOKEN) || null;
        let result = this.parseJwt(token);

        return JSON.parse(result["values"]);
    }

    public token() {
        return localStorage.getItem(this.X_ACCESS_TOKEN) || null; 
    }


}
