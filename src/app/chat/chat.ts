// chat.ts
import { Component, inject, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '../app-layout/auth.service';
import { SocketService } from '../socket';

@Component({
  selector: 'app-chat',
  standalone: true,
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
  imports: [CommonModule, ReactiveFormsModule],
})

export class Chat implements OnInit, OnDestroy {
  @ViewChild('messagesContainer') messagesList!: ElementRef<HTMLDivElement>;
  API_BASE = 'http://10.131.210.84:3000';
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  authService = inject(AuthService);
  socketService = inject(SocketService);

  form: FormGroup = this.fb.group({
    message: ['', Validators.required],
  });

  messages: { text: string; sender: string; timestamp: string }[] = [];
  currentUser: string = ""

  private subscription: any;
  

  ngOnInit(): void {
    const user = this.authService.currentUserSig();
    this.currentUser = user?.fullName || 'Unknown';
    this.loadMessages();
    this.subscription = this.socketService.listenForMessages().subscribe((msg) => {
      this.messages.push(msg);
      this.scrollToBottom();
    });
  }
scrollToBottom(): void {
  setTimeout(() => {
    const container = this.messagesList?.nativeElement;
    container?.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
  });
}

  ngOnDestroy(): void {
    this.socketService.disconnect();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadMessages() {
    this.http.get<any[]>(`${this.API_BASE}/api/messages`).subscribe({
      next: (data) => {
        this.messages = data.reverse();
        this.scrollToBottom();
      },
      error: (err) => console.error('Failed to load messages', err),
    });
  }

  sendMessage(): void {
    if (this.form.invalid) return;

    const currentUser = this.authService.currentUserSig();
    const payload = {
      text: this.form.value.message,
      sender: currentUser?.fullName || 'Unknown',
    };

    this.http.post(`${this.API_BASE}/api/messages`, payload).subscribe({
      next: () => {
        this.form.reset();
        // No need to manually add message, socket will push it
      },
      error: (err) => console.error('Failed to send message', err),
    });
  }
}
