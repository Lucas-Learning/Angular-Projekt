import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet, RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../app/app-layout/auth.service';
import { UserInterface } from '../app/app-layout/user.interface';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  authService = inject(AuthService);
  http = inject(HttpClient);
  router = inject(Router);

  ngOnInit(): void {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    })
  }

  logout(): void {
    console.log('logout');
    this.authService.logout();
    this.router.navigateByUrl('/');
  }
}
