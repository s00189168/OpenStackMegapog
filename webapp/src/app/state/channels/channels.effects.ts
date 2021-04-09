import { Injectable } from '@angular/core';
import { catchError, switchMap } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { ChannelsService } from '../../services/channels.service';
import {
  readChannelsAction,
  readChannelsByIdAction, readChannelsByIdFailureAction, readChannelsByIdSuccessAction,
  readChannelsFailureAction,
  readChannelsSuccessAction
} from './channels.actions';

@Injectable()
export class ChannelsEffects {
  loadChannels$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(readChannelsAction),
      switchMap(() => {
        return this.channelsService.getAllChannels().pipe(
          switchMap((channels) =>
            [readChannelsSuccessAction({ channels })]
          ),
          catchError((error) => [readChannelsFailureAction({ error })])
        );
      })
    );
  });

  /*loadChannelsById$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(readChannelsByIdAction),
      switchMap(({ id }) => {
        return this.channelsService.getChannelById(id).pipe(
          switchMap((channel) =>
            [readChannelsByIdSuccessAction({ channel })]
          ),
          catchError((error) => [readChannelsByIdFailureAction({ error })])
        );
      })
    );
  });

  Commented this out for now as it wasn't working, sorry
  */

  constructor(
    private actions$: Actions,
    private channelsService: ChannelsService
  ) {}
}
