import { createAction, props } from '@ngrx/store';
import { Channel } from '../../types/channel.type';

const actionPrefix = '[channels]';

export const readChannelsAction = createAction(`${actionPrefix} Read Channels`);
export const readChannelsSuccessAction = createAction(
  `${actionPrefix} Read Channels Success`,
  props<{ channels: Channel[]; }>()
);
export const readChannelsFailureAction = createAction(
  `${actionPrefix} Read Channels Failure`,
  props<{ error: Error }>()
);

export const readChannelsByIdAction = createAction(`${actionPrefix} Read Channels By Id`, props<{ id: string; }>());
export const readChannelsByIdSuccessAction = createAction(
  `${actionPrefix} Read Channels By Id Success`,
  props<{ channel: Channel; }>()
);
export const readChannelsByIdFailureAction = createAction(
  `${actionPrefix} Read Channels By Id Failure`,
  props<{ error: Error }>()
);
