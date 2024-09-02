import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private URL = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { username: string; password: string }): Observable<User> {
    return this.http.post<User>(this.URL, credentials);
  }

  // Check if the user is logged in
  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('current_user');
  }

  // Redirect to login page if the user is not logged in
  checkLoginAndRedirect() {
    if (!this.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }

  // You can add other methods like login, logout, etc.
  logout() {
    sessionStorage.removeItem('current_user');
    this.router.navigate(['/login']);
  }
}
