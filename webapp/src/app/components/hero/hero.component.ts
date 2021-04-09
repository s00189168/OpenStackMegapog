import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'pog-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent implements OnInit {
  callbackUrl = "https://id.twitch.tv/oauth2/authorize?client_id=" + environment.TWITCH_CLIENT_ID + "&redirect_uri=" + environment.TWICH_CALLBACK + "&response_type=token&scope=user%3Aread%3Aemail+user%3Aread%3Abroadcast+channel%3Amanage%3Abroadcast+channel%3Aread%3Aredemptions+chat%3Aread+channel%3Amoderate+bits%3Aread+channel_subscriptions+channel%3Aread%3Asubscriptions+channel%3Aedit%3Acommercial&state=c3abfaa609xAc1e793a29g361f00r471";
  authenticated;
  constructor(
    private authService: AuthService,
  ) {
    this.authenticated = authService.authValue && authService.authValue["valid"];
  }

  ngOnInit(): void {
  }
}
