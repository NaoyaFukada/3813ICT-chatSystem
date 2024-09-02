import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterOutlet, RouterLink, FormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginData = { username: '', password: '' };
  errorMessage: string = '';

  constructor(private router: Router, private AuthService: AuthService) {}

  ngOnInit(): void {
    if (this.AuthService.isLoggedIn()) {
      this.router.navigate(['/chat']);
    }
  }

  onSubmit() {
    console.log(this.loginData.username);
    console.log(this.loginData.password);
    this.AuthService.login(this.loginData).subscribe(
      (data: any) => {
        if (data.userInfo) {
          sessionStorage.setItem('current_user', JSON.stringify(data.userInfo));
          console.log(data.userInfo);
          this.router.navigate(['/chat']);
        }
      },
      (error) => {
        // Handle errors like 400 or 401 from the server
        this.errorMessage =
          error.error.message || 'An error occurred during login';
        console.log(this.errorMessage);
      }
    );
    this.loginData = { username: '', password: '' };
  }
}
