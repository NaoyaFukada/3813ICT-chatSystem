import { Component, Input, OnInit, ElementRef, ViewChild } from '@angular/core';
import { NgIf } from '@angular/common';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GroupService } from '../services/group.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-channel-management',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, NgClass],
  templateUrl: './channel-management.component.html',
  styleUrl: './channel-management.component.css',
})
export class ChannelManagementComponent implements OnInit {
  @Input() selectedGroup: any; // Receive selectedGroup from parent component

  @ViewChild('channelNameInput', { static: false })
  channelNameInput!: ElementRef;

  isEditing: boolean[] = []; // Track which channels are being edited
  addingChannel: boolean = false; // State for whether a new channel is being added
  newChannelName: string = ''; // Holds the new channel name
  originalChannelNames: { id: string; name: string }[] = []; // Store original channel objects
  editingChannelNames: { id: string; name: string }[] = []; // Temporary storage for editing channel objects

  constructor(private GroupService: GroupService) {}

  ngOnInit() {
    // Reinitialize the editingChannelNames array with the latest data
    this.editingChannelNames = [...this.selectedGroup.channels];
    console.log('editingChannelNames', this.editingChannelNames);
  }

  cancelEdit(index: number) {
    this.isEditing[index] = false;
    this.editingChannelNames[index] = { ...this.originalChannelNames[index] }; // Restore original name
  }

  editChannel(index: number, inputRef: HTMLInputElement) {
    this.isEditing[index] = true;
    this.originalChannelNames[index] = {
      ...this.selectedGroup.channels[index],
    }; // Store original object
    setTimeout(() => {
      inputRef.focus();
      const length = inputRef.value.length;
      inputRef.setSelectionRange(length, length); // Set cursor at the end
    }, 0);
  }

  saveChannelName(index: number) {
    this.isEditing[index] = false;
    const updatedChannelName = this.editingChannelNames[index].name;
    console.log('Channel name updated:', updatedChannelName);
    this.GroupService.updateChannelName(
      this.selectedGroup.id,
      this.originalChannelNames[index].id,
      updatedChannelName
    ).subscribe(() => {
      this.selectedGroup.channels[index].name = updatedChannelName; // Update the actual value after saving
      console.log('Channel name saved to server:', updatedChannelName);
    });
  }

  deleteChannel(
    group: any,
    channel: { id: string; name: string },
    index: number
  ) {
    this.GroupService.deleteChannel(group.id, channel.id).subscribe(
      (updatedGroup) => {
        console.log(updatedGroup);
        this.selectedGroup.channels.splice(index, 1); // Remove channel from group
        this.editingChannelNames.splice(index, 1); // Remove channel from temporary storage
        console.log('Channel deleted:', channel.name);
      }
    );
  }

  // Focus on the input field when clicking the list item
  AddfocusInputField(event: MouseEvent) {
    if (this.channelNameInput) {
      this.channelNameInput.nativeElement.focus();
    }
  }

  saveChannel() {
    if (this.newChannelName.trim()) {
      const newChannel = {
        id: 'channel-' + Math.random().toString(36).substring(2, 15), // Generate a random ID
        name: this.newChannelName.trim(),
        banned_users: [],
      };

      this.GroupService.addChannel(this.selectedGroup.id, newChannel).subscribe(
        (updatedGroup) => {
          this.selectedGroup = updatedGroup;
          this.editingChannelNames.push(newChannel); // Add new channel to temporary storage
          console.log('New channel added:', newChannel.name);
          this.newChannelName = '';
          this.addingChannel = false;
        }
      );
    }
  }

  startAddingChannel() {
    this.addingChannel = true;
    setTimeout(() => {
      if (this.channelNameInput) {
        this.channelNameInput.nativeElement.focus();
      }
    }, 0);
  }

  cancelChannel() {
    this.newChannelName = '';
    this.addingChannel = false;
  }
}
