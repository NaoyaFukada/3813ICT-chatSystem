import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, NgFor],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  username: string = 'JohnDoe';
  email: string = 'john.doe@example.com';
  role: string = 'Member';
  isEditing: boolean = false;
  groups = [{ name: 'Group 1' }, { name: 'Group 2' }, { name: 'Group 3' }];

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.saveProfile();
    }
  }

  saveProfile() {
    // Logic to save the profile information can be added here
    console.log('Profile saved', this.username, this.email, this.role);
  }

  deleteAccount() {
    if (
      confirm(
        'Are you sure you want to delete your account? This action cannot be undone.'
      )
    ) {
      // Logic to delete the account can be added here
      console.log('Account deleted');
    }
  }
}
