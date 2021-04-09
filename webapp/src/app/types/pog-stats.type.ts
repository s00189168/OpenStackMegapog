export interface PogStats {
  pog?: number;
  pogchamp?: number;
  pogu?: number;
  poggers?: number;
}

export interface GlobalPogStats {
  totals: PogStats;
  timeseries: Record<string, PogStats>;
}
