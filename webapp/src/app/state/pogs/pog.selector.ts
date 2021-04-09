import { createSelector, MemoizedSelector } from '@ngrx/store';
import { selectGlobalPogStatsFeature } from '../index';
import { PogState } from '../types/pog-state.type';
import { FetchState } from '../types/fetch-state.type';
import { GlobalPogStats } from '../../types/pog-stats.type';

export const selectGlobalPogStatsDataState: MemoizedSelector<
  PogState,
  GlobalPogStats
  > = createSelector(selectGlobalPogStatsFeature, (state) => state.data);

export const selectGlobalPogStatsFetchState: MemoizedSelector<PogState, FetchState>
  = createSelector(selectGlobalPogStatsFeature, (state) => state.fetch);

export const selectGlobalPogStatsAreLoading: MemoizedSelector<PogState, boolean> = createSelector(
  selectGlobalPogStatsFetchState, (state) => state.loading
);

export const selectGlobalPogStatsHasError: MemoizedSelector<PogState, boolean> = createSelector(
  selectGlobalPogStatsFetchState, (state) => Boolean(state.loading)
);

export const selectGlobalPogStatsSuccessfulAt: MemoizedSelector<PogState, string> = createSelector(
  selectGlobalPogStatsFetchState, (state) => state.successfulAt
);
