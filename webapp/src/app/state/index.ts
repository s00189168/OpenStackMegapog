import { PogState } from './types/pog-state.type';

export const selectChannelsFeature = (state: PogState) => state.channels;
export const selectGlobalPogStatsFeature = (state: PogState) => state.globalPogStats;
