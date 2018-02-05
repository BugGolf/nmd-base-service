var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
var BaseAuth = /** @class */ (function () {
    function BaseAuth(http) {
        this.http = http;
        this.authorization_url = ''; // Authorization : Example http://[authorization_url]
        this.authorization_url_login = '/login'; // Authorization : Example http://[authorization_url]/[login]   Get Refresh Token
        this.authorization_url_logout = '/logout'; // Authorization : Example http://[authorization_url]/[logout]  Clear Token
        this.authorization_url_token = '/accessToken'; // Authorization : Example http://[authorization_url]/[token]   Get Access Token
        this.X_REFRESH_TOKEN = 'X-REFRESH-TOKEN';
        this.X_ACCESS_TOKEN = 'X-ACCESS-TOKEN';
        this.REFRESH_TOKEN = localStorage.getItem(this.X_REFRESH_TOKEN);
        this.ACCESS_TOKEN = localStorage.getItem(this.X_ACCESS_TOKEN);
    }
    BaseAuth.prototype.parseJwt = function (token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse(window.atob(base64));
    };
    BaseAuth.prototype.validJwt = function (token) {
        var payloads = this.parseJwt(token);
        //console.log(payloads);
        return parseInt(payloads['exp']) > ((new Date).getTime() / 1000);
    };
    BaseAuth.prototype.clearToken = function () {
        localStorage.removeItem(this.X_ACCESS_TOKEN);
        localStorage.removeItem(this.X_REFRESH_TOKEN);
    };
    BaseAuth.prototype.getToken = function () {
        var _this = this;
        var token = localStorage.getItem(this.X_REFRESH_TOKEN) || null;
        this.http.get(this.authorization_url + this.authorization_url_token, {
            headers: new HttpHeaders().set(this.X_REFRESH_TOKEN, token),
            responseType: 'json'
        }).subscribe(function (res) {
            if (res["accessToken"]) {
                var accessToken = res["accessToken"];
                localStorage.setItem(_this.X_ACCESS_TOKEN, accessToken);
            }
            else {
                _this.clearToken();
            }
        }, function (e) {
            _this.clearToken();
        });
    };
    BaseAuth.prototype.login = function (userId, passId) {
        var _this = this;
        var values = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            values[_i - 2] = arguments[_i];
        }
        if (userId && passId) {
            return new Promise(function (resolve) {
                // Basic Authorization
                var authen = 'Basic ' + btoa(userId + ":" + passId);
                // Each for HttpParams
                var params = new HttpParams();
                values.forEach(function (e) {
                    if (e.value != null)
                        params = params.append(e.key, e.value);
                });
                _this.http.get(_this.authorization_url + _this.authorization_url_login, {
                    headers: new HttpHeaders().set('Authorization', authen),
                    params: params,
                    responseType: "json"
                }).subscribe(function (res) {
                    if (res["accessToken"] && res["refreshToken"]) {
                        var accessToken = res["accessToken"];
                        var refreshToken = res["refreshToken"];
                        localStorage.setItem(_this.X_ACCESS_TOKEN, accessToken);
                        localStorage.setItem(_this.X_REFRESH_TOKEN, refreshToken);
                        resolve(true);
                    }
                    else {
                        resolve(false);
                    }
                }, function (e) { resolve(false); });
            });
        }
        else {
            return new Promise(function (resolve) { return resolve(false); });
        }
    };
    BaseAuth.prototype.logout = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.http.get(_this.authorization_url + _this.authorization_url_logout, {
                headers: new HttpHeaders().set(_this.X_REFRESH_TOKEN, _this.REFRESH_TOKEN),
                responseType: 'text'
            }).subscribe(function (res) {
                _this.clearToken();
                resolve(true);
            }, function (e) { resolve(false); }, function () { resolve(false); });
        });
    };
    BaseAuth.prototype.logged = function () {
        // ตรวจสอบ Access Token จาก localStorage
        var token = localStorage.getItem(this.X_ACCESS_TOKEN) || null;
        if (token) {
            // ถ้าพบ Access Token นั้นหมายความว่าเข้าใช้งานระบบแล้ว
            var validToken = this.validJwt(token);
            // ตรวจสอบ Access Token ว่าหมดอายุหรือยัง?
            if (!validToken) {
                // หากหมดอายุแล้วจะต้องขอใหม่
                this.getToken();
            }
            return true;
        }
        else {
            return false;
        }
    };
    BaseAuth.prototype.payloads = function () {
        var token = localStorage.getItem(this.X_ACCESS_TOKEN) || null;
        var result = this.parseJwt(token);
        return JSON.parse(result["values"]);
    };
    BaseAuth.prototype.token = function () {
        return localStorage.getItem(this.X_ACCESS_TOKEN) || null;
    };
    BaseAuth = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient])
    ], BaseAuth);
    return BaseAuth;
}());
export { BaseAuth };
//# sourceMappingURL=base-auth.js.map