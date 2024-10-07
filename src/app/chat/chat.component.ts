import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { GroupService } from '../services/group.service';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { Group } from '../models/group.model';
import { NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { ChannelService } from '../services/channel.service';
import { SocketService } from '../services/socket.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, OnDestroy {
  selectedGroup: Group | null = null;
  selectedChannel: any | null = null;
  currentUser: any;
  groups: Group[] = [];
  channels: any[] = [];
  isUserInChannel: boolean = false;
  isUserPendingApproval: boolean = false;
  chatMessages: any[] = [];
  messageContent: string = '';

  // Create a cache (map) to store userId -> username
  userCache: { [key: string]: string } = {};

  constructor(
    private GroupService: GroupService,
    private AuthService: AuthService,
    private UserService: UserService,
    private router: Router,
    private ChannelService: ChannelService,
    private SocketService: SocketService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.AuthService.getUserInfo();
    this.loadGroups();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      alert('You need to be logged in to see this page');
    }
    this.initSocketConnection();
  }

  // Detect if the user closes the tab or navigates away
  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: Event) {
    if (this.selectedChannel) {
      this.SocketService.leaveChannel(
        this.selectedChannel._id,
        this.currentUser.username
      );
    }
  }

  ngOnDestroy(): void {
    if (this.selectedChannel) {
      this.SocketService.leaveChannel(
        this.selectedChannel._id,
        this.currentUser.username
      );
    }
  }

  loadGroups() {
    this.GroupService.getGroups().subscribe((data: Group[]) => {
      this.groups = data.filter((group) =>
        group.users.includes(this.currentUser.id)
      );
      if (this.groups.length > 0) {
        this.selectGroup(this.groups[0].id);
      }
    });
  }

  selectGroup(groupId: string) {
    this.selectedGroup = this.groups.find((g) => g.id === groupId) || null;

    if (this.selectedGroup) {
      this.channels = [];
      this.selectedGroup.channels.forEach((channelId: string) => {
        this.ChannelService.getChannelById(channelId).subscribe(
          (channel) => {
            this.channels.push(channel);
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
    if (this.selectedChannel) {
      this.SocketService.leaveChannel(
        this.selectedChannel._id,
        this.currentUser.username
      );
    }
    this.selectedChannel = channel;
    this.isUserInChannel = channel.channelUsers.includes(this.currentUser.id);
    this.isUserPendingApproval = channel.pendingUsers.includes(
      this.currentUser.id
    );
    this.loadChatMessages(channel._id);
    this.SocketService.joinChannel(channel._id, this.currentUser.username);
  }

  loadChatMessages(channelId: string) {
    this.SocketService.getChatMessages(channelId).subscribe((messages) => {
      this.chatMessages = messages;
      this.chatMessages.forEach((msg) => {
        this.getUsername(msg.userId);
      });
    });
  }

  // Function to get the username from the cache or make an HTTP request if necessary
  getUsername(userId: string) {
    // Check if the username is already in the cache
    if (this.userCache[userId]) {
      // If it exists, update the message object with the cached username
      this.chatMessages.forEach((msg) => {
        if (msg.userId === userId) {
          msg.username = this.userCache[userId];
        }
      });
    } else {
      // If not in cache, fetch from the server
      this.UserService.getUserById(userId).subscribe((user) => {
        // Store the username in the cache
        this.userCache[user.id] = user.username;

        // Update the messages with the newly fetched username
        this.chatMessages.forEach((msg) => {
          if (msg.userId === userId) {
            msg.username = user.username;
          }
        });
      });
    }
  }

  requestToJoinChannel() {
    this.ChannelService.requestToJoinChannel(
      this.selectedChannel._id,
      this.currentUser.id
    ).subscribe(
      (response) => {
        alert('Request sent to join the channel.');
        this.isUserPendingApproval = true;
      },
      (error) => {
        console.error('Error requesting to join the channel:', error);
        alert('Failed to send request to join the channel.');
      }
    );
  }

  initSocketConnection() {
    this.SocketService.initSocket();

    // Listen for normal chat messages
    this.SocketService.getMessages().subscribe((message: any) => {
      this.chatMessages.push(message);
      this.getUsername(message.userId); // Load username for new messages
    });

    // Listen for system messages (user join/leave events)
    this.SocketService.getSystemMessages().subscribe((message: any) => {
      this.chatMessages.push({ message: message.message, system: true });
    });
  }

  sendMessage() {
    if (this.messageContent.trim() && this.selectedChannel) {
      const message = {
        channelId: this.selectedChannel._id,
        userId: this.currentUser.id,
        message: this.messageContent.trim(),
      };
      this.SocketService.sendMessage(message);
      console.log(this.SocketService);
      this.messageContent = '';
    } else {
      console.log('No message to send or channel not selected.');
    }
  }
}
