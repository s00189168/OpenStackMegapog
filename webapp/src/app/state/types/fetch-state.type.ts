export interface FetchState {
  loading: boolean;
  error: Error | null;
  successfulAt: string | null;
}
