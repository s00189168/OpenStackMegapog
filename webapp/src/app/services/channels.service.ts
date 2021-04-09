import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Channel } from '../types/channel.type';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

const baseUrl = environment.API_BASE;

export interface ChannelResponse {
  count: number;
  items: Channel[];
}

@Injectable({
  providedIn: 'root',
})
export class ChannelsService {
  constructor(private httpClient: HttpClient) {}

  getAllChannels(): Observable<Channel[]> {
    return this.httpClient.get<ChannelResponse>(`${baseUrl}/channels`)
      .pipe(
        map(response => response.items)
      );
  }

  getActiveChannels(): Observable<Channel[]> {
    return this.httpClient.get<Channel[]>(`${baseUrl}/channels/active`);
  }

  getChannelById(id: string): Observable<Channel> {
    return this.httpClient.get<Channel>(`${baseUrl}/channels/${id}`);
  }

  getMyChannel(id: string): Observable<Channel> {
    return this.httpClient.get<Channel>(`${baseUrl}/channels/mine`);
  }
}
