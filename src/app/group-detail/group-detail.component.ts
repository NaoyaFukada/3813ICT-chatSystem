import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-group-detail',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './group-detail.component.html',
  styleUrl: './group-detail.component.css',
})
export class GroupDetailComponent {
  @Input() selectedGroup: any; // Receive selectedGroup from parent component
  selectedTab: string = 'channel_management'; // Default tab

  selectChannelManagement() {
    this.selectedTab = 'channel_management';
  }

  selectUserManagement() {
    this.selectedTab = 'user_management';
  }

  editChannel(channel: any) {
    // Placeholder function for editing a channel
    console.log('Edit Channel', channel);
  }

  deleteChannel(group: any, channel: any) {
    // Placeholder function for deleting a channel within a group
    console.log('Delete Channel', group, channel);
  }

  addChannel(group: any) {
    // Placeholder function for adding a new channel within a group
    console.log('Add New Channel', group);
  }

  approveInterest(group: any, interest: any) {
    // Placeholder function for approving a user's interest in joining a group
    console.log('Approve Interest', group, interest);
  }

  declineInterest(group: any, interest: any) {
    // Placeholder function for declining a user's interest in joining a group
    console.log('Decline Interest', group, interest);
  }

  banUserFromChannel(group: any, user: any) {
    // Placeholder function for banning a user from a channel
    console.log('Ban User from Channel', group, user);
  }

  removeUserFromGroup(group: any, user: any) {
    // Placeholder function for removing a user from a group
    console.log('Remove User from Group', group, user);
  }

  reportToSuperAdmin(group: any, user: any) {
    // Placeholder function for reporting a user to the Super Admin
    console.log('Report to Super Admin', group, user);
  }
}
