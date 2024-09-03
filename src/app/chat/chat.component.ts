import { Component, OnInit } from '@angular/core';
import { GroupService } from '../services/group.service';
import { AuthService } from '../services/auth.service';
import { Group } from '../models/group.model';
import { NgFor } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [NgFor],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  selectedGroup: Group | null = null;
  selectedChannel: string | null = null;
  currentUser: any;
  groups: Group[] = [];
  channels: any[] = [];

  constructor(
    private GroupService: GroupService,
    private AuthService: AuthService,
    private router: Router
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
    // Find the selected group and show its channels
    this.selectedGroup = this.groups.find((g) => g.id === groupId) || null;
    if (this.selectedGroup) {
      this.channels = [...this.selectedGroup.channels]; // Clone the channels array

      // Select the first channel as default if available
      if (this.channels.length > 0) {
        this.selectChannel(this.channels[0].name);
      } else {
        this.selectedChannel = null;
      }
    }
  }

  selectChannel(channelName: string) {
    this.selectedChannel = channelName;
  }
}
