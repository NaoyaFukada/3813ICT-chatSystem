import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { GroupService } from '../services/group.service';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { Group } from '../models/group.model';
import { NgFor, NgIf, CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ChannelService } from '../services/channel.service';
import { SocketService } from '../services/socket.service';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { PeerService } from '../services/peer.service';

interface VideoElement {
  muted: boolean;
  srcObject: MediaStream;
  userId: string;
}

const gdmOptions = {
  video: true,
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    sampleRate: 44100,
  },
};

const gumOptions = {
  audio: true,
  video: {
    width: { ideal: 640 },
    height: { ideal: 360 },
  },
};

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, NgClass, CommonModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('localVideo') localVideo!: ElementRef;

  selectedGroup: Group | null = null;
  selectedChannel: any | null = null;
  currentUser: any;
  groups: Group[] = [];
  channels: any[] = [];
  isUserInChannel: boolean = false;
  isUserPendingApproval: boolean = false;
  chatMessages: any[] = [];
  messageContent: string = '';
  selectedImage: File | null = null;
  imagePreview: string | null = null;
  remoteStreams: MediaStream[] = [];
  isCallStarted = false;

  userCache: { [key: string]: { username: string; profile_img_path: string } } =
    {};

  constructor(
    private GroupService: GroupService,
    private AuthService: AuthService,
    private UserService: UserService,
    private router: Router,
    private ChannelService: ChannelService,
    private SocketService: SocketService,
    private PeerService: PeerService
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
      this.selectedGroup = null;
      this.selectedChannel = null;
    });
  }

  selectGroup(groupId: string) {
    this.selectedGroup = this.groups.find((g) => g.id === groupId) || null;
    if (this.selectedGroup) {
      this.channels = [];
      this.selectedGroup.channels.forEach((channelId: string) => {
        this.ChannelService.getChannelById(channelId).subscribe((channel) => {
          this.channels.push(channel);
        });
      });
      this.selectedChannel = null;
      this.isUserInChannel = false;
      this.isUserPendingApproval = false;
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
        this.getUserInfo(msg.userId);
      });
    });
  }

  getUserInfo(userId: string) {
    if (this.userCache[userId]) {
      this.chatMessages.forEach((msg) => {
        if (msg.userId === userId) {
          msg.username = this.userCache[userId].username;
          msg.profile_img_path = this.userCache[userId].profile_img_path;
        }
      });
    } else {
      this.UserService.getUserById(userId).subscribe((user) => {
        this.userCache[user.id] = {
          username: user.username,
          profile_img_path: user.profile_img_path,
        };
        this.chatMessages.forEach((msg) => {
          if (msg.userId === user.id) {
            msg.username = user.username;
            msg.profile_img_path = user.profile_img_path;
          }
        });
      });
    }
  }

  requestToJoinChannel() {
    this.ChannelService.requestToJoinChannel(
      this.selectedChannel._id,
      this.currentUser.id
    ).subscribe(() => {
      this.isUserPendingApproval = true;
    });
  }

  initSocketConnection() {
    this.SocketService.initSocket();

    this.SocketService.getMessages().subscribe((message: any) => {
      this.chatMessages.push(message);
      this.getUserInfo(message.userId);
    });

    this.SocketService.getSystemMessages().subscribe((systemMessage: any) => {
      this.chatMessages.push({
        message: systemMessage.message,
        system: true, // Mark it as a system message
      });
    });
  }

  triggerFileUpload() {
    this.fileInput.nativeElement.click();
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImage = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(this.selectedImage);
    }
  }

  clearImage() {
    this.selectedImage = null;
    this.imagePreview = null;
    this.fileInput.nativeElement.value = '';
  }

  sendMessage() {
    if (this.selectedImage) {
      this.SocketService.uploadImage(this.selectedImage).subscribe(
        (response) => {
          const imageUrl = response.imageUrl;
          const message = {
            channelId: this.selectedChannel._id,
            userId: this.currentUser.id,
            message: this.messageContent.trim(),
            imageUrl,
          };
          this.SocketService.sendMessage(message);
          this.clearMessage();
        }
      );
    } else if (this.messageContent.trim() && this.selectedChannel) {
      const message = {
        channelId: this.selectedChannel._id,
        userId: this.currentUser.id,
        message: this.messageContent.trim(),
        imageUrl: '',
      };
      this.SocketService.sendMessage(message);
      this.clearMessage();
    }
  }

  clearMessage() {
    this.messageContent = '';
    this.clearImage();
  }

  isSameDay(timestamp1: string, timestamp2: string): boolean {
    const date1 = new Date(timestamp1).toDateString();
    const date2 = new Date(timestamp2).toDateString();
    return date1 === date2;
  }

  // Video chat implementation
  async streamCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      this.localVideo.nativeElement.srcObject = stream;
      this.PeerService.addMyVideo(stream);
      this.PeerService.callPeer(stream);
      this.isCallStarted = true;
    } catch (err) {
      console.error('Error accessing the camera:', err);
    }
  }

  endCall() {
    this.PeerService.endCall();
    this.isCallStarted = false;
  }
}
