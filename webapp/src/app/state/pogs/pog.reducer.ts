import { Action, createReducer, on } from '@ngrx/store';
import { FetchState } from '../types/fetch-state.type';
import { GlobalPogStats } from '../../types/pog-stats.type';
import {
  readGlobalPogStatsAction,
  readGlobalPogStatsFailureAction,
  readGlobalPogStatsSuccessAction
} from './pog.actions';

export interface GlobalPogStatsState {
  fetch: FetchState;
  data: GlobalPogStats;
}

export const initialGlobalPogStatsState: GlobalPogStatsState = {
  fetch: { loading: false, error: null, successfulAt: null },
  data: null
};

export const globalPogStatsReducer = createReducer(
  initialGlobalPogStatsState,
  on(readGlobalPogStatsAction, (state) => ({ ...state, fetch: { ...state.fetch, loading: true } })),
  on(readGlobalPogStatsSuccessAction, (state, payload) => ({
    ...state,
    data: payload.pogStats,
    fetch: { ...state.fetch, loading: false, successfulAt: new Date().toISOString() }
  })),
  on(readGlobalPogStatsFailureAction, (state, payload) => ({
    ...state,
    fetch: { ...state.fetch, loading: false, error: payload.error }
  }))
);

export function reducer(state: GlobalPogStatsState | undefined, action: Action): GlobalPogStatsState {
  return globalPogStatsReducer(state, action);
}
