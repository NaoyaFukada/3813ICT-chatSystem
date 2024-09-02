import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import { NgIf } from '@angular/common';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GroupService } from '../services/group.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-group-user-management',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, NgClass],
  templateUrl: './group-user-management.component.html',
  styleUrl: './group-user-management.component.css',
})
export class GroupUserManagementComponent {
  @Input() selectedGroup: any; // Receive selectedGroup from parent component

  constructor(private GroupService: GroupService) {}

  approveInterest(group: any, interest: any) {
    console.log('Approve Interest', group, interest);
  }

  declineInterest(group: any, interest: any) {
    console.log('Decline Interest', group, interest);
  }

  banUserFromChannel(group: any, user: any) {
    console.log('Ban User from Channel', group, user);
  }

  removeUserFromGroup(group: any, user: any) {
    console.log('Remove User from Group', group, user);
  }

  reportToSuperAdmin(group: any, user: any) {
    console.log('Report to Super Admin', group, user);
  }
}
