import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { GlobalPogStats } from '../types/pog-stats.type';

const baseUrl = environment.API_BASE;

@Injectable({
  providedIn: 'root',
})
export class PogService {
  constructor(private httpClient: HttpClient) {}

  getGlobalPogStats(): Observable<GlobalPogStats> {
    return this.httpClient.get<GlobalPogStats>(`${baseUrl}/pogs`);
  }
}
