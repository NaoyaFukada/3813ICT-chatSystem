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

  // This method will retrieve all groups where the adminId is either the current user's ID or "super"
  getGroupsForSuperAdmin(adminId: string): Observable<Group[]> {
    let params = new HttpParams();
    params = params.set('adminId', adminId).append('adminId', 'super');
    return this.http.get<Group[]>(this.URL, { params });
  }

  getGroupById(groupId: string): Observable<Group> {
    return this.http.get<Group>(`${this.URL}/${groupId}`);
  }

  addGroup(group: Group): Observable<Group> {
    return this.http.post<Group>(this.URL, group);
  }

  // Method to register interest in a group
  registerInterest(groupId: string, userId: string): Observable<any> {
    return this.http.put(`${this.URL}/${groupId}/register-interest`, {
      userId,
    });
  }

  deleteGroup(id: string, adminId: string): Observable<void> {
    const params = new HttpParams().set('adminId', adminId);
    return this.http.delete<void>(`${this.URL}/${id}`, { params });
  }

  updateGroupName(groupId: string, newGroupName: string): Observable<Group> {
    return this.http.put<Group>(`${this.URL}/${groupId}/name`, {
      newGroupName,
    });
  }

  updateGroupAdminToSuper(groupId: string): Observable<void> {
    return this.http.put<void>(`${this.URL}/${groupId}/admin-to-super`, {});
  }
}
