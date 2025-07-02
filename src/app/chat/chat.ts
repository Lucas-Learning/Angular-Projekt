import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '../app-layout/auth.service';
import { io, Socket } from 'socket.io-client';

@Component({
  selector: 'app-chat',
  standalone: true,
  templateUrl: './chat.html',
  imports: [CommonModule, ReactiveFormsModule],
})
export class Chat implements OnInit, OnDestroy {
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  authService = inject(AuthService);

  form: FormGroup = this.fb.group({
    message: ['', Validators.required],
  });

  messages: { text: string; sender: string; timestamp: string }[] = [];

  socket!: Socket;

  ngOnInit(): void {
    this.loadMessages();

    // ✅ Connect to your Socket.IO server
    this.socket = io('http://localhost:3000');

    // ✅ Listen for 'message' events
    this.socket.on('message', (msg) => {
      this.messages.unshift(msg); // Add new message to top
    });
  }

  ngOnDestroy(): void {
    // ✅ Clean up connection
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  loadMessages() {
    this.http.get<any[]>('http://localhost:3000/api/messages').subscribe({
      next: (data) => (this.messages = data.reverse()),
      error: (err) => console.error('Failed to load messages', err),
    });
  }

  sendMessage(): void {
    if (this.form.invalid) return;

    const currentUser = this.authService.currentUserSig();
    const payload = {
      text: this.form.value.message,
      sender: currentUser?.emailId || 'Unknown',
    };

    this.http.post('http://localhost:3000/api/messages', payload).subscribe({
      next: () => {
        this.form.reset();
        // ❌ Don't reload all messages again
        // ✅ Instead, rely on socket.io to receive the new one
      },
      error: (err) => console.error('Failed to send message', err),
    });
  }
}
