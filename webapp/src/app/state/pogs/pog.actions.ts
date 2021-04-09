import { createAction, props } from '@ngrx/store';
import { GlobalPogStats } from '../../types/pog-stats.type';

const actionPrefix = '[pog-stats]';

export const readGlobalPogStatsAction = createAction(`${actionPrefix} Read Global PogStats`);
export const readGlobalPogStatsSuccessAction = createAction(
  `${actionPrefix} Read Global PogStats Success`,
  props<{ pogStats: GlobalPogStats; }>()
);
export const readGlobalPogStatsFailureAction = createAction(
  `${actionPrefix} Read Global PogStats Failure`,
  props<{ error: Error }>()
);
