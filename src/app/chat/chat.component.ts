import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent {
  contextMenuVisible = false;
  contextMenuPosition = { x: 0, y: 0 };
  selectedGroup: string | null = null;

  openChannels(groupName: string) {
    // Handle opening channels for the selected group
    console.log(`Opening channels for ${groupName}`);
  }

  openContextMenu(event: MouseEvent, groupName: string) {
    event.preventDefault();
    this.contextMenuPosition = { x: event.clientX, y: event.clientY };
    this.contextMenuVisible = true;
    this.selectedGroup = groupName;
  }

  leaveGroup(event: MouseEvent) {
    if (this.selectedGroup) {
      console.log(`Leaving group: ${this.selectedGroup}`);
      // Implement the logic to remove the group from the UI or notify the server
      this.contextMenuVisible = false;
    }
    event.stopPropagation(); // Prevent the click event from propagating and closing the menu immediately
  }

  closeContextMenu(event: MouseEvent) {
    this.contextMenuVisible = false;
  }
}
