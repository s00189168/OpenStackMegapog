import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TopStreamsContainer } from './containers/top-streams/top-streams.container';
import { MyChannelContainer } from './containers/my-channel/my-channel.container';
import { ConnectContainer } from './containers/connect/connect.container';
import { ChannelDetailContainer } from './containers/channel-detail/channel-detail.container';
import { NotFoundContainer } from './containers/not-found/not-found.container';
import { LoadTopChannelsGuard } from './guards/load-top-channels.guard';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'home',
    component: TopStreamsContainer,
    canActivate: [LoadTopChannelsGuard],
  },
  {
    path: 'top-streams',
    component: TopStreamsContainer,
    canActivate: [LoadTopChannelsGuard],
    children: [
      { path: ':channelId', component: ChannelDetailContainer }
    ],
    pathMatch: 'full'
  },
  {
    path: '',
    pathMatch: 'full',
    component: TopStreamsContainer,
    canActivate: [LoadTopChannelsGuard],
  },
  { path: 'my-channel', component: MyChannelContainer, canActivate: [AuthGuard] },
  { path: 'connect', component: ConnectContainer },
  { path: '404', component: NotFoundContainer },
  { path: '**', redirectTo: '404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],

})
export class AppRoutingModule {}
