import { ChannelState } from '../channels/channels.reducer';
import { GlobalPogStatsState } from '../pogs/pog.reducer';

export interface PogState {
  channels: ChannelState;
  globalPogStats: GlobalPogStatsState;
}

export interface PogRootState {
  pogState: PogState;
}
