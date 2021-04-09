import { Injectable } from '@angular/core';
import { catchError, switchMap } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { ChannelsService } from '../../services/channels.service';
import {
  readGlobalPogStatsAction,
  readGlobalPogStatsFailureAction,
  readGlobalPogStatsSuccessAction
} from './pog.actions';
import { PogService } from '../../services/pog.service';

@Injectable()
export class PogEffects {
  loadGlobalPogStats$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(readGlobalPogStatsAction),
      switchMap(() => {
        return this.pogService.getGlobalPogStats().pipe(
          switchMap((pogStats) =>
            [readGlobalPogStatsSuccessAction({ pogStats })]
          ),
          catchError((error) => [readGlobalPogStatsFailureAction({ error })])
        );
      })
    );
  });

  constructor(
    private actions$: Actions,
    private pogService: PogService
  ) {}
}
