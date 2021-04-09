import { BrowserModule } from '@angular/platform-browser';
import { isDevMode, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConnectContainer } from './containers/connect/connect.container';
import { MyChannelContainer } from './containers/my-channel/my-channel.container';
import { TopStreamsContainer } from './containers/top-streams/top-streams.container';
import { ChannelDetailContainer } from './containers/channel-detail/channel-detail.container';
import { NotFoundContainer } from './containers/not-found/not-found.container';
import { ChannelsService } from './services/channels.service';
import { ChannelsEffects } from './state/channels/channels.effects';
import { rootReducer } from './state/root-reducer';
import { LoadTopChannelsGuard } from './guards/load-top-channels.guard';
import { HeroComponent } from './components/hero/hero.component';
import { NgcCookieConsentModule, NgcCookieConsentConfig } from 'ngx-cookieconsent';
import { PogEffects } from './state/pogs/pog.effects';
import { PogStatsChartComponent } from './components/pog-stats-chart/pog-stats-chart.component';
import { HomeTotalStatsComponent } from './components/home-total-stats/home-total-stats.component';
import { CommonModule } from '@angular/common';

const cookieConfig:NgcCookieConsentConfig = {
  cookie: {
    domain: 'megapog.com'
  },
  palette: {
    popup: {
      background: '#ddd'
    },
    button: {
      background: '#ffb73f'
    }
  },
  theme: 'edgeless',
  type: 'opt-out'
};
@NgModule({
  declarations: [
    AppComponent,
    ConnectContainer,
    MyChannelContainer,
    TopStreamsContainer,
    ChannelDetailContainer,
    NotFoundContainer,
    HeroComponent,
    PogStatsChartComponent,
    HomeTotalStatsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    StoreModule.forRoot(rootReducer),
    EffectsModule.forRoot([ChannelsEffects, PogEffects]),
    NgcCookieConsentModule.forRoot(cookieConfig),
  ],

  providers: [ChannelsService, LoadTopChannelsGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
