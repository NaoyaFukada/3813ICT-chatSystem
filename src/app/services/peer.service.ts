import { Injectable } from '@angular/core';
import { SocketService } from '../services/socket.service';
import { Observable } from 'rxjs';
import { Peer } from 'peerjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class PeerService {
  myPeerId = uuidv4();
  myPeer: any;
  streamCamera: any;
  streamScreen: any;

  constructor() {
    this.myPeer = new Peer(this.myPeerId, {
      host: 'localhost',
      // host: 'localhost',
      secure: true,
      port: 3001,
      path: '/',
    });
  }
}
