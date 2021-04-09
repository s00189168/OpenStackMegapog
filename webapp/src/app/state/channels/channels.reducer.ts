import { Action, createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';

import { Channel } from '../../types/channel.type';
import {
  readChannelsAction,
  readChannelsByIdAction,
  readChannelsByIdFailureAction,
  readChannelsByIdSuccessAction,
  readChannelsFailureAction,
  readChannelsSuccessAction
} from './channels.actions';
import { FetchState } from '../types/fetch-state.type';

export interface ChannelState {
  fetch: FetchState;
  data: EntityState<Channel>;
}

export const initialChannelState: ChannelState = {
  fetch: { loading: false, error: null, successfulAt: null },
  data: { entities: {}, ids: [] }
};

export const channelEntityAdapter = createEntityAdapter<Channel>();

export const channelsReducer = createReducer(
  initialChannelState,
  on(readChannelsAction, (state) => ({ ...state, fetch: { ...state.fetch, loading: true } })),
  on(readChannelsSuccessAction, (state, payload) => ({
    ...state,
    data: channelEntityAdapter.setAll(payload.channels, state.data),
    fetch: { ...state.fetch, loading: false, successfulAt: new Date().toISOString() }
  })),
  on(readChannelsFailureAction, (state, payload) => ({
    ...state,
    fetch: { ...state.fetch, loading: false, error: payload.error }
  })),
  on(readChannelsByIdAction, (state) => ({ ...state, fetch: { ...state.fetch, loading: true } })),
  on(readChannelsByIdSuccessAction, (state, payload) => ({
    ...state,
    data: channelEntityAdapter.addOne(payload.channel, state.data),
    fetch: { ...state.fetch, loading: false, successfulAt: new Date().toISOString() }
  })),
  on(readChannelsByIdFailureAction, (state, payload) => ({
    ...state,
    fetch: { ...state.fetch, loading: false, error: payload.error }
  })),
);

export function reducer(state: ChannelState | undefined, action: Action): ChannelState {
  return channelsReducer(state, action);
}
