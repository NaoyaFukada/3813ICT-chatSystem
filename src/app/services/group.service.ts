import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Group } from '../models/group.model';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private URL = 'http://localhost:3000/api/groups';

  constructor(private http: HttpClient) {}

  // This enables user to receive all of the groups as well
  getGroups(adminId?: string): Observable<Group[]> {
    let params = new HttpParams();
    if (adminId) {
      params = params.set('adminId', adminId);
    }
    return this.http.get<Group[]>(this.URL, { params });
  }

  addGroup(group: Group): Observable<Group> {
    return this.http.post<Group>(this.URL, group);
  }

  deleteGroup(id: string, adminId: string): Observable<void> {
    const params = new HttpParams().set('adminId', adminId);
    return this.http.delete<void>(`${this.URL}/${id}`, { params });
  }

  addChannel(groupId: string, channelName: string): Observable<Group> {
    return this.http.post<Group>(`${this.URL}/${groupId}/channels`, {
      channelName,
    });
  }

  updateChannelName(
    groupId: string,
    oldChannelName: string,
    newChannelName: string
  ): Observable<Group> {
    return this.http.put<Group>(
      `${this.URL}/${groupId}/channels/${oldChannelName}`,
      { newChannelName } // Sending the new channel name in the request body
    );
  }

  deleteChannel(groupId: string, channelName: string): Observable<Group> {
    return this.http.delete<Group>(
      `${this.URL}/${groupId}/channels/${channelName}`
    );
  }

  getGroupById(groupId: string): Observable<Group> {
    return this.http.get<Group>(`${this.URL}/${groupId}`);
  }
}
