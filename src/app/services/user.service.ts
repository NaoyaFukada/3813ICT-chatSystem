import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { Group } from '../models/group.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  private URL = 'http://localhost:3000/api';

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.URL}/users`);
  }

  approveInterest(groupId: string, userId: string): Observable<Group> {
    return this.http.put<Group>(`${this.URL}/groups/${groupId}/approve`, {
      userId,
    });
  }

  declineInterest(groupId: string, userId: string): Observable<Group> {
    return this.http.put<Group>(`${this.URL}/groups/${groupId}/decline`, {
      userId,
    });
  }

  banUserFromChannel(
    groupId: string,
    userId: string,
    channelId: string
  ): Observable<Group> {
    return this.http.put<Group>(
      `${this.URL}/groups/${groupId}/channels/${channelId}/ban`,
      { userId }
    );
  }

  removeUserFromGroup(groupId: string, userId: string): Observable<Group> {
    return this.http.put<Group>(`${this.URL}/groups/${groupId}/remove`, {
      userId,
    });
  }

  reportUserToSuperAdmin(groupId: string, userId: string): Observable<Group> {
    return this.http.put<Group>(`${this.URL}/groups/${groupId}/report`, {
      userId,
    });
  }

  updateUserRole(userId: string, newRole: string): Observable<User> {
    return this.http.put<User>(`${this.URL}/users/${userId}/role`, {
      role: newRole,
    });
  }

  deleteUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.URL}/users/${userId}`);
  }
}
