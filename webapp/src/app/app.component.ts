import { Component, isDevMode } from '@angular/core';
import { environment } from '../environments/environment';
import { AuthService } from './services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgcCookieConsentService, NgcInitializeEvent, NgcNoCookieLawEvent, NgcStatusChangeEvent } from 'ngx-cookieconsent';
import { Subscription } from 'rxjs';

@Component({
  selector: 'pog-root',
  template: `
    <div class="header">
      <div class="navigation-bar">
        <ul class="navigation-menu">
          <li class="navigation-item">
            <a href="/">
              <img src="assets/images/favicon.png" class="nav-icon" />
              <img src="assets/images/logo.png" class="nav-logo d-none d-md-inline-block" alt="Megapog" />
            </a>
          </li>
          <li
            class="navigation-item"
            [routerLink]="['home']"
          >
            Top Streams
          </li>
          <li
            class="navigation-item"
            routerLinkActive="is-selected"
            [routerLink]="['my-channel']"
            *ngIf=authenticated
          >
            My Channel
          </li>
          <li class="navigation-item" *ngIf=!authenticated>
            <a href="{{callbackUrl}}">Login</a>
          </li>
          <li class="navigation-item" *ngIf=authenticated (click)="logout()">
            Logout
          </li>
        </ul>
      </div>
    </div>
    <div class="body">
      <router-outlet></router-outlet>
    </div>

  `,
  styleUrls: ['./app.component.css'],
})

export class AppComponent {
  callbackUrl = "https://id.twitch.tv/oauth2/authorize?client_id=" + environment.TWITCH_CLIENT_ID + "&redirect_uri=" + environment.TWICH_CALLBACK + "&response_type=token&scope=user%3Aread%3Aemail+user%3Aread%3Abroadcast+channel%3Amanage%3Abroadcast+channel%3Aread%3Aredemptions+chat%3Aread+channel%3Amoderate+bits%3Aread+channel_subscriptions+channel%3Aread%3Asubscriptions+channel%3Aedit%3Acommercial&state=c3abfaa609xAc1e793a29g361f00r471";
  private popupOpenSubscription: Subscription;
  private popupCloseSubscription: Subscription;
  private initializeSubscription: Subscription;
  private statusChangeSubscription: Subscription;
  private revokeChoiceSubscription: Subscription;
  private noCookieLawSubscription: Subscription;
  authenticated;

  constructor(
    private authService:AuthService,
    private ccService: NgcCookieConsentService
    ){
    this.authenticated = authService.authValue && authService.authValue["valid"];
  }

  logout(){
    this.authService.logout();
    window.location.replace("/");
  }

  // searchBarShown = false;
  /*
    toggleSearch(): void {
    this.searchBarShown = !this.searchBarShown;
    }
  */
 
  ngOnInit() {
  }
 
  ngOnDestroy() {
    // unsubscribe to cookieconsent observables to prevent memory leaks
    this.popupOpenSubscription.unsubscribe();
    this.popupCloseSubscription.unsubscribe();
    this.initializeSubscription.unsubscribe();
    this.statusChangeSubscription.unsubscribe();
    this.revokeChoiceSubscription.unsubscribe();
    this.noCookieLawSubscription.unsubscribe();
  }
}
