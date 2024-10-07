import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { GroupService } from '../services/group.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, NgFor],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user: any | null = null;
  username: string = '';
  email: string = '';
  role: string = '';
  isEditing: boolean = false;
  groups: any[] = [];
  // Store original profile values to reset on error
  private originalUsername: string = '';
  private originalEmail: string = '';

  constructor(
    private AuthService: AuthService,
    private groupService: GroupService,
    private UserService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.AuthService.getUserInfo();
    console.log(this.user);

    if (this.user != null) {
      this.username = this.user.username;
      this.email = this.user.email;
      this.role = this.user.roles;

      // Store original values
      this.originalUsername = this.username;
      this.originalEmail = this.email;

      this.user.groups.forEach((groupId: string) => {
        this.groupService.getGroupById(groupId).subscribe((group) => {
          this.groups.push(group); // Add the group to the list
        });
      });
    }
    if (!this.user) {
      // Redirect to the login page
      this.router.navigate(['/login']);
      alert('You need to be logged in to see this page');
    }
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.saveProfile();
    }
  }

  saveProfile() {
    // Check if the username or email has changed
    if (
      this.username === this.originalUsername &&
      this.email === this.originalEmail
    ) {
      // No changes, close the edit mode
      this.isEditing = false;
      return;
    }

    if (confirm('Are you sure you want to save the changes to your profile?')) {
      // Check for username uniqueness
      this.UserService.getUsers().subscribe((users) => {
        const existingUser = users.find(
          (u) => u.username === this.username && u.id !== this.user.id
        );
        if (existingUser) {
          this.resetProfileFields();
          alert('Username already exists. Please choose a different one.');
        } else {
          // Proceed to update the user's information
          this.UserService.updateUserProfile(this.user.id, {
            username: this.username,
            email: this.email,
          }).subscribe(
            (updatedUser) => {
              alert('Profile updated successfully.');
              this.user = updatedUser;
              this.originalUsername = this.username;
              this.originalEmail = this.email;
              this.AuthService.updateUserInfo(this.user);
            },
            (error) => {
              console.error('Error updating profile:', error);
              alert('Failed to update profile. Please try again.');
              this.resetProfileFields();
            }
          );
        }
      });
    }
  }

  leaveGroup(groupId: string) {
    if (confirm('Are you sure you want to leave this group?')) {
      this.groupService.getGroupById(groupId).subscribe((group) => {
        const isAdmin = group.adminId === this.user.id;
        console.log(isAdmin);

        this.groupService.removeUserFromGroup(groupId, this.user.id).subscribe(
          () => {
            if (isAdmin) {
              // Update group adminId to "super" on the server side
              this.groupService.updateGroupAdminToSuper(groupId).subscribe(
                () => {
                  console.log('Group adminId updated to "super".');
                },
                (error) => {
                  console.error(
                    'Error updating group adminId to "super":',
                    error
                  );
                }
              );
            }

            alert('You have left the group.');
            this.groups = this.groups.filter((group) => group.id !== groupId);
            this.user.groups = this.user.groups.filter(
              (id: string) => id !== groupId
            );
            this.AuthService.updateUserInfo(this.user);
          },
          (error) => {
            console.error('Error leaving group:', error);
            alert('Failed to leave the group. Please try again.');
          }
        );
      });
    }
  }

  deleteAccount() {
    if (
      confirm(
        'Are you sure you want to delete your account? This action cannot be undone.'
      )
    ) {
      this.UserService.deleteUser(this.user.id).subscribe(
        () => {
          alert('Account deleted successfully.');
          this.AuthService.logout();
        },
        (error) => {
          console.error('Error deleting account:', error);
          alert('Failed to delete account. Please try again.');
        }
      );
    }
  }

  private resetProfileFields() {
    this.username = this.originalUsername;
    this.email = this.originalEmail;
  }
}
