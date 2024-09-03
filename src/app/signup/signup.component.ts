import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { FormsModule } from '@angular/forms';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  username: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(
    private UserService: UserService,
    private router: Router,
    private appComponent: AppComponent
  ) {}

  onSignup() {
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const newUser = {
      id: 'user-' + Math.random().toString(36).substring(2, 15), // Generate a random ID
      username: this.username,
      email: '',
      password: this.password,
      roles: ['Chat User'],
      groups: [],
      interest_groups: [],
      banned_channels: [],
      reported_in_groups: [],
    };

    this.UserService.addUser(newUser).subscribe(
      () => {
        alert('Signup successful!');
        sessionStorage.setItem('current_user', JSON.stringify(newUser));
        this.appComponent.updateRole();
        this.router.navigate(['/chat']); // Redirect to login page after successful signup
      },
      (error) => {
        console.error('Error during signup:', error);
        alert('Signup failed. Please try again.');
      }
    );
  }
}
