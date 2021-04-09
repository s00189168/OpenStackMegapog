import { createSelector, MemoizedSelector } from '@ngrx/store';
import { EntityState } from '@ngrx/entity';
import { Channel } from '../../types/channel.type';
import { selectChannelsFeature } from '../index';
import { PogState } from '../types/pog-state.type';
import { EntitySelectors } from '@ngrx/entity/src/models';
import { channelEntityAdapter } from './channels.reducer';
import { FetchState } from '../types/fetch-state.type';

export const selectChannelDataState: MemoizedSelector<
  PogState,
  EntityState<Channel>
  > = createSelector(selectChannelsFeature, (state) => state.data);

export const {
  selectIds: selectChannelIds,
  selectEntities: selectChannelEntities,
  selectAll: selectAllChannels,
  selectTotal: selectChannelsTotal,
}: EntitySelectors<Channel, PogState> = channelEntityAdapter.getSelectors(
  selectChannelDataState
);

export const selectChannelFetchState: MemoizedSelector<PogState, FetchState>
  = createSelector(selectChannelsFeature, (state) => state.fetch);

export const selectChannelsIsLoading: MemoizedSelector<PogState, boolean> = createSelector(
  selectChannelFetchState, (state) => state.loading
);

export const selectChannelsHasError: MemoizedSelector<PogState, boolean> = createSelector(
  selectChannelFetchState, (state) => Boolean(state.loading)
);

export const selectChannelsSuccessfulAt: MemoizedSelector<PogState, string> = createSelector(
  selectChannelFetchState, (state) => state.successfulAt
);
