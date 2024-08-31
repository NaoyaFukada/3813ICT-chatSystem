import { Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-user-manegement',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './user-manegement.component.html',
  styleUrl: './user-manegement.component.css',
})
export class UserManegementComponent {
  searchQuery: string = ''; // To hold the search input

  users = [
    {
      username: 'User1',
      role: 'chat_user',
      reported: true,
      reportContext: 'Spamming',
      reportedBy: 'Admin1',
    },
    {
      username: 'User2',
      role: 'group_admin',
      reported: false,
      reportContext: '',
      reportedBy: '',
    },
    {
      username: 'User3',
      role: 'super_admin',
      reported: false,
      reportContext: '',
      reportedBy: '',
    },
    {
      username: 'User4',
      role: 'chat_user',
      reported: false,
      reportContext: '',
      reportedBy: '',
    },
    {
      username: 'User5',
      role: 'chat_user',
      reported: true,
      reportContext: 'Harassment',
      reportedBy: 'Admin2',
    },
    {
      username: 'User6',
      role: 'group_admin',
      reported: false,
      reportContext: '',
      reportedBy: '',
    },
    {
      username: 'User7',
      role: 'chat_user',
      reported: false,
      reportContext: '',
      reportedBy: '',
    },
    {
      username: 'User8',
      role: 'chat_user',
      reported: true,
      reportContext: 'Inappropriate Language',
      reportedBy: 'Admin3',
    },
    {
      username: 'User9',
      role: 'super_admin',
      reported: false,
      reportContext: '',
      reportedBy: '',
    },
    {
      username: 'User10',
      role: 'chat_user',
      reported: false,
      reportContext: '',
      reportedBy: '',
    },
    {
      username: 'User11',
      role: 'chat_user',
      reported: false,
      reportContext: '',
      reportedBy: '',
    },
    {
      username: 'User12',
      role: 'group_admin',
      reported: false,
      reportContext: '',
      reportedBy: '',
    },
    {
      username: 'User13',
      role: 'chat_user',
      reported: false,
      reportContext: '',
      reportedBy: '',
    },
    {
      username: 'User14',
      role: 'group_admin',
      reported: true,
      reportContext: 'Disruptive Behavior',
      reportedBy: 'Admin4',
    },
    {
      username: 'User15',
      role: 'chat_user',
      reported: false,
      reportContext: '',
      reportedBy: '',
    },
    {
      username: 'User16',
      role: 'chat_user',
      reported: false,
      reportContext: '',
      reportedBy: '',
    },
    {
      username: 'User17',
      role: 'super_admin',
      reported: false,
      reportContext: '',
      reportedBy: '',
    },
    {
      username: 'User18',
      role: 'chat_user',
      reported: true,
      reportContext: 'Spamming Links',
      reportedBy: 'Admin5',
    },
    {
      username: 'User19',
      role: 'group_admin',
      reported: false,
      reportContext: '',
      reportedBy: '',
    },
    {
      username: 'User20',
      role: 'chat_user',
      reported: false,
      reportContext: '',
      reportedBy: '',
    },
  ];

  // By using get, you can access this as a regular property
  get filteredUsers() {
    if (!this.searchQuery) {
      return this.users;
    }
    return this.users.filter(
      (user) =>
        user.username.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (user.reportedBy &&
          user.reportedBy
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase()))
    );
  }

  // Search Method
  updateSearchQuery(event: Event) {
    this.searchQuery = (event.target as HTMLInputElement).value;
    console.log(this.searchQuery);
  }
}
