import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GroupService } from '../services/group.service';
import { NgClass } from '@angular/common';
import { ChannelManagementComponent } from '../channel-management/channel-management.component';
import { GroupUserManagementComponent } from '../group-user-management/group-user-management.component';

@Component({
  selector: 'app-group-detail',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    FormsModule,
    NgClass,
    ChannelManagementComponent,
    GroupUserManagementComponent,
  ],
  templateUrl: './group-detail.component.html',
  styleUrl: './group-detail.component.css',
})
export class GroupDetailComponent {
  @Input() selectedGroup: any; // Receive selectedGroup from parent component

  selectedTab: string = 'channel_management'; // Default tab
  newGroupName: string = ''; // Holds the new group name

  constructor(private GroupService: GroupService) {}

  reloadGroupData() {
    // Fetch the latest selectedGroup data from the server
    this.GroupService.getGroupById(this.selectedGroup.id).subscribe(
      (updatedGroup) => {
        this.selectedGroup = updatedGroup;
        console.log(this.selectedGroup);
      }
    );
  }

  // Navigation Tab
  selectChannelManagement() {
    this.selectedTab = 'channel_management';
    this.reloadGroupData();
  }

  selectUserManagement() {
    this.selectedTab = 'user_management';
    this.reloadGroupData();
  }

  selectChangeGroupName() {
    this.selectedTab = 'change_group_name';
    this.newGroupName = this.selectedGroup.groupname; // Set the current group name in the input
    this.reloadGroupData();
  }

  changeGroupName() {
    if (this.newGroupName.trim()) {
      this.selectedGroup.groupname = this.newGroupName.trim();
      this.GroupService.updateGroupName(
        this.selectedGroup.id,
        this.newGroupName.trim()
      ).subscribe(
        (updatedGroup) => {
          console.log('Group name changed to:', updatedGroup.groupname);
          this.selectedGroup = updatedGroup;
        },
        (error) => {
          console.error('Error updating group name:', error);
        }
      );
    }
  }
}
