import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-group-management',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule],
  templateUrl: './group-management.component.html',
  styleUrl: './group-management.component.css',
})
export class GroupManagementComponent {
  selectedGroup: any = null; // Placeholder for selected group
  selectedChannel: any = null; // Placeholder for selected channel
  selectedTab: string = 'channel_management'; // Default tab
  searchQuery: string = ''; // To hold the search input

  // Group Management
  // Dummy data for demonstration purposes
  groups = [
    {
      name: 'Group 1',
      channels: [{ name: 'Channel 1' }, { name: 'Channel 2' }],
      users: [{ username: 'User1' }, { username: 'User2' }],
      interests: [{ username: 'User9' }, { username: 'User10' }],
    },
    {
      name: 'Group 2',
      channels: [{ name: 'Channel 1' }, { name: 'Channel 2' }],
      users: [{ username: 'User3' }, { username: 'User4' }],
      interests: [{ username: 'User11' }, { username: 'User12' }],
    },
    {
      name: 'Group 3',
      channels: [
        { name: 'Channel 1' },
        { name: 'Channel 2' },
        { name: 'Channel 3' },
      ],
      users: [
        { username: 'User5' },
        { username: 'User6' },
        { username: 'User7' },
      ],
      interests: [{ username: 'User13' }],
    },
    // Add more groups as needed
  ];

  // Filtering the groups based on search input
  get filteredGroups() {
    if (!this.searchQuery) {
      return this.groups;
    }
    return this.groups.filter((group) =>
      group.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  selectGroup(group: any) {
    this.selectedGroup = group;
    this.selectedChannel = null; // Clear channel selection when group is selected

    // Scroll to the group header
    setTimeout(() => {
      const element = document.getElementById('group-management-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 0);
  }

  goBackToGroups() {
    this.selectedGroup = null;
    this.selectedChannel = null;
  }

  selectChannelManagement() {
    this.selectedTab = 'channel_management';
  }

  selectUserManagement() {
    this.selectedTab = 'user_management';
  }

  addGroup() {
    // Placeholder function for adding a new group
    console.log('Add New Group');
  }

  deleteGroup(group: any) {
    // Placeholder function for deleting a group
    console.log('Delete Group', group);
  }

  addChannel(group: any) {
    // Placeholder function for adding a new channel within a group
    console.log('Add New Channel', group);
  }

  editChannel(channel: any) {
    // Placeholder function for editing a channel
    console.log('Edit Channel', channel);
  }

  deleteChannel(group: any, channel: any) {
    // Placeholder function for deleting a channel within a group
    console.log('Delete Channel', group, channel);
  }

  approveInterest(group: any, interest: any) {
    // Placeholder function for approving a user's interest in joining a group
    console.log('Approve Interest', group, interest);
  }

  declineInterest(group: any, interest: any) {
    // Placeholder function for declining a user's interest in joining a group
    console.log('Decline Interest', group, interest);
  }

  removeUserFromGroup(group: any, user: any) {
    // Placeholder function for removing a user from a group
    console.log('Remove User from Group', group, user);
  }

  banUserFromChannel(group: any, user: any) {
    // Placeholder function for banning a user from a channel
    console.log('Ban User from Channel', group, user);
  }

  reportToSuperAdmin(group: any, user: any) {
    // Placeholder function for reporting a user to the Super Admin
    console.log('Report to Super Admin', group, user);
  }

  // Search Method
  updateSearchQuery(event: Event) {
    this.searchQuery = (event.target as HTMLInputElement).value;
    console.log(this.searchQuery);
  }
}
