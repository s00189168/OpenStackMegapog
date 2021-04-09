import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';

import { PogState } from '../state/types/pog-state.type';
import { readChannelsAction } from '../state/channels/channels.actions';

@Injectable({
  providedIn: 'root',
})
export class LoadTopChannelsGuard implements CanActivate {
  constructor(private store: Store<PogState>) {}

  canActivate(): Observable<boolean> {
    //this.store.dispatch(readChannelsAction());
    // Todo: Bring back when needed

    return of(true);
  }
}
