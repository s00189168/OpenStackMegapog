import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private authService: AuthService) { }
    canActivate(router: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const auth = this.authService.authValue;
        if (auth && auth["valid"]) {
            return true;
        }
        const callbackUrl = "https://id.twitch.tv/oauth2/authorize?client_id=" + environment.TWITCH_CLIENT_ID + "&redirect_uri=" + environment.TWICH_CALLBACK + "&response_type=token&scope=user%3Aread%3Aemail+user%3Aread%3Abroadcast+channel%3Amanage%3Abroadcast+channel%3Aread%3Aredemptions+chat%3Aread+channel%3Amoderate+bits%3Aread+channel_subscriptions+channel%3Aread%3Asubscriptions+channel%3Aedit%3Acommercial&state=c3abfaa609xAc1e793a29g361f00r471";
        window.location.href = callbackUrl;
        return false;
    }
}