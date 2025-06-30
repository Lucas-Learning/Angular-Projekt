import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../app/app-layout/auth.service';
import { UserInterface } from '../app/app-layout/user.interface';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './app.html',
})
export class App {
  authService = inject(AuthService);
  http = inject(HttpClient);

  ngOnInit(): void {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    })
    this.http
      .get<{ user: UserInterface }>('/api/getusers')
      .subscribe({
        next: (response) => {
          console.log('response', response);
          this.authService.currentUserSig.set(response.user);
        },
        error: () => {
          this.authService.currentUserSig.set(null);
        },
      });
  }

  logout(): void {
    console.log('logout');
    localStorage.setItem('token', '');
    this.authService.currentUserSig.set(null);
  }
}
