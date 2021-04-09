import { ActionReducerMap } from '@ngrx/store';
import { PogState } from './types/pog-state.type';
import { channelsReducer } from './channels/channels.reducer';
import { globalPogStatsReducer } from './pogs/pog.reducer';

export const rootReducer: ActionReducerMap<PogState> = {
  channels: channelsReducer,
  globalPogStats: globalPogStatsReducer
};
