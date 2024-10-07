import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import io from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private URL = 'http://localhost:3000/api';
  private SERVER_URL = 'http://localhost:3000';
  private socket: any;

  constructor(private http: HttpClient) {}

  // Initialize Socket.IO
  public initSocket(): void {
    this.socket = io(this.SERVER_URL);
  }

  // Fetch chat messages for a channel
  getChatMessages(channelId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.URL}/channels/${channelId}/messages`);
  }

  // Send a message using Socket.IO
  public sendMessage(data: {
    channelId: string;
    userId: string;
    message: string;
  }): void {
    this.socket.emit('chatMessage', data);
  }

  // Listen for incoming messages via Socket.IO
  public getMessages(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('chatMessage', (message: any) => observer.next(message));
    });
  }

  // Listen for system messages (join/leave events)
  public getSystemMessages(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('systemMessage', (message: any) => observer.next(message));
    });
  }

  // Join a specific channel room and send username
  public joinChannel(channelId: string, username: string): void {
    this.socket.emit('joinChannel', { channelId, username });
  }

  // Leave a specific channel room and send username
  public leaveChannel(channelId: string, username: string): void {
    this.socket.emit('leaveChannel', { channelId, username });
  }
}
