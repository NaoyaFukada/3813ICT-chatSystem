import { Component, ViewChild } from '@angular/core';
import { NgIf } from '@angular/common';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserManegementComponent } from '../user-manegement/user-manegement.component';
import { GroupManagementComponent } from '../group-management/group-management.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    FormsModule,
    UserManegementComponent,
    GroupManagementComponent,
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent {
  role: string = 'super_admin'; // Or 'group_admin', set dynamically based on the user's role
  selectedSection: string = 'user_management'; // Default to user management section
  selectedGroup: any = null; // Placeholder for selected group
  selectedChannel: any = null; // Placeholder for selected channel
  selectedTab: string = 'channel_management'; // Default tab

  @ViewChild(GroupManagementComponent)
  groupManagementComponent!: GroupManagementComponent;

  selectSection(section: string) {
    this.selectedSection = section;
    this.selectedGroup = null;
    this.selectedChannel = null;
    this.groupManagementComponent.selectedGroup = null;
  }

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
  ];

  selectGroup(group: any) {
    this.selectedGroup = group;
    this.selectedChannel = null; // Clear channel selection when group is selected
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
}
