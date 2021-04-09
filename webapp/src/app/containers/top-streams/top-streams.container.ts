import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { PogState } from '../../state/types/pog-state.type';
import { selectAllChannels } from '../../state/channels/channels.selector';
import { readGlobalPogStatsAction } from '../../state/pogs/pog.actions';
import { selectGlobalPogStatsDataState } from '../../state/pogs/pog.selector';


@Component({
  selector: 'pog-top-streams',
  template: `
    <pog-hero></pog-hero>
    <pog-home-total-stats [pogStats]="globalPogStats$ | async"></pog-home-total-stats>
    <pog-stats-chart [pogStats]="globalPogStats$ | async"></pog-stats-chart>
  `,
  styleUrls: ['./top-streams.container.css']
})
export class TopStreamsContainer implements OnInit {
  channels$ = this.store.select(selectAllChannels);
  globalPogStats$ = this.store.select(selectGlobalPogStatsDataState);

  constructor(private store: Store<PogState>) {}

  ngOnInit(): void {
    this.store.dispatch(readGlobalPogStatsAction());
  }
}
