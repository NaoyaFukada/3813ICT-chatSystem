import { Component, OnInit } from '@angular/core';
import { GroupService } from '../services/group.service';
import { AuthService } from '../services/auth.service';
import { Group } from '../models/group.model';
import { NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { ChannelService } from '../services/channel.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  selectedGroup: Group | null = null;
  selectedChannel: any | null = null; // Updated type to any since we fetch full channel data now
  currentUser: any;
  groups: Group[] = [];
  channels: any[] = [];
  isUserInChannel: boolean = false; // Flag to check if user is in the selected channel
  isUserPendingApproval: boolean = false;

  constructor(
    private GroupService: GroupService,
    private AuthService: AuthService,
    private router: Router,
    private ChannelService: ChannelService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.AuthService.getUserInfo();
    this.loadGroups();
    if (!this.currentUser) {
      // Redirect to the login page
      this.router.navigate(['/login']);
      alert('You need to be logged in to see this page');
    }
  }

  loadGroups() {
    // Fetch groups for the current user
    this.GroupService.getGroups().subscribe((data: Group[]) => {
      this.groups = data.filter((group) =>
        group.users.includes(this.currentUser.id)
      );

      // Select the first group and its channels by default
      if (this.groups.length > 0) {
        this.selectGroup(this.groups[0].id);
      }
    });
  }

  selectGroup(groupId: string) {
    // Find the selected group
    this.selectedGroup = this.groups.find((g) => g.id === groupId) || null;

    if (this.selectedGroup) {
      // Fetch the channels based on channel IDs in the selected group
      this.channels = [];
      this.selectedGroup.channels.forEach((channelId: string) => {
        this.ChannelService.getChannelById(channelId).subscribe(
          (channel) => {
            this.channels.push(channel); // Add the full channel object to channels

            // Select the first channel as default if available
            if (this.channels.length === 1) {
              this.selectChannel(this.channels[0]);
            }
          },
          (error) => {
            console.error(
              `Error fetching channel with ID: ${channelId}`,
              error
            );
          }
        );
      });

      if (this.channels.length === 0) {
        this.selectedChannel = null;
        this.isUserInChannel = false;
        this.isUserPendingApproval = false;
      }
    }
  }

  selectChannel(channel: any) {
    this.selectedChannel = channel;
    this.isUserInChannel = channel.users.includes(this.currentUser.id);
    this.isUserPendingApproval = channel.pendingUsers.includes(
      this.currentUser.id
    );
    console.log(channel.users.includes(this.currentUser.id));
    console.log(this.isUserInChannel);
  }

  requestToJoinChannel() {
    this.ChannelService.requestToJoinChannel(
      this.selectedChannel.id,
      this.currentUser.id
    ).subscribe(
      (response) => {
        console.log('Request sent to join the channel:', response);
        alert('Request sent to join the channel.');
        this.isUserPendingApproval = true;
      },
      (error) => {
        console.error('Error requesting to join the channel:', error);
        alert('Failed to send request to join the channel.');
      }
    );
  }
}
