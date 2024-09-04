import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Channel } from '../models/channel.model';

@Injectable({
  providedIn: 'root',
})
export class ChannelService {
  private URL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // Add new channel
  addChannel(
    groupId: string,
    channel: {
      id: string;
      name: string;
      users: string[];
      pendingUsers: string[];
      banned_users: string[];
    }
  ): Observable<Channel> {
    return this.http.post<Channel>(
      `${this.URL}/groups/${groupId}/channels`,
      channel
    );
  }

  // Get channel detail by it's id
  getChannelById(channelId: string): Observable<Channel> {
    return this.http.get<Channel>(`${this.URL}/channels/${channelId}`);
  }

  // Update channel name
  updateChannelName(
    channelId: string,
    newChannelName: string
  ): Observable<Channel> {
    return this.http.put<Channel>(
      `${this.URL}/channels/${channelId}`, // Use only the channel ID in the URL
      { newChannelName } // Sending the new channel name in the request body
    );
  }

  // Delete channel
  deleteChannel(groupId: string, channelId: string): Observable<Channel> {
    return this.http.delete<Channel>(
      `${this.URL}/groups/${groupId}/channels/${channelId}`
    );
  }

  // Approve user from channel
  approveUserForChannel(channelId: string, userId: string): Observable<any> {
    return this.http.put<any>(`${this.URL}/channels/${channelId}/approveUser`, {
      userId,
    });
  }

  // Decline user from channel
  declineUserForChannel(channelId: string, userId: string): Observable<any> {
    return this.http.put<any>(`${this.URL}/channels/${channelId}/declineUser`, {
      userId,
    });
  }

  // Ban user from channel
  banUserFromChannel(channelId: string, userId: string): Observable<any> {
    return this.http.put<any>(`${this.URL}/channels/${channelId}/banUser`, {
      userId,
    });
  }

  // Request to join a channel
  requestToJoinChannel(channelId: string, userId: string): Observable<any> {
    return this.http.put<any>(
      `${this.URL}/channels/${channelId}/requestToJoin`,
      { userId }
    );
  }
}
