// src/app/socket.service.ts
import { Injectable, OnDestroy } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService implements OnDestroy {
  private socket: Socket;

  constructor() {
    this.socket = io('http://10.0.11.4:3000'); // your backend URL
  }

  listenForMessages(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('message', (data) => {
        observer.next(data);
      });

      // Optional cleanup
      return () => this.socket.off('message');
    });
  }

  sendMessage(msg: { text: string; sender: string }) {
    this.socket.emit('message', msg);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
