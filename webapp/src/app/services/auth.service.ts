import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private auth: object;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private http: HttpClient
    ) {
        this.auth = null;
        const cookies = this.readKeyValuesFromCookie();
        if (cookies["token"]) {
            this.auth = {
                "token": cookies["token"],
                "login": cookies["login"],
                "name": cookies["name"],
                "expiresAt": Date.parse(cookies["expiresAt"]),
                "valid": (Date.parse(cookies["expiresAt"]) > Date.now()),
            };
        }
    }

    public get authValue(): any {
        return this.auth;
    }

    logout() {
        const cookies = this.readKeyValuesFromCookie();
        for (var cookey in cookies){
            if (cookies.hasOwnProperty(cookey)) {
                this.deleteCookie(cookey);
            }
        }
    }

    private readKeyValuesFromCookie() {
        let cookieJar = {};
        if (document.cookie) {
            document.cookie
                .split(';')
                .map( pair => pair.split( '=' ) )
                .filter( pair => pair.length == 2 )
                .map( pair => [ pair[0].trim(), pair[1].trim() ] )
                .filter( pair => pair[0] != 'expires')
                .forEach(element => {
                    cookieJar[element[0]] = element[1];
                });
            ;
        }
        return cookieJar;
    }

    private setCookie(name, value, expirydays) {
        var d = new Date();
        d.setTime(d.getTime() + (expirydays*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        if (window.location.href.indexOf("localhost") > -1) {
            document.cookie = name + "=" + value + "; " + expires;
        } else {
            document.cookie = name + "=" + value + ";path=/;domain=megapog.com; " + expires;
        }
    }

    private deleteCookie(name){
        this.setCookie(name, "", -1);
    }
}