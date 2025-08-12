import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../app-layout/auth.service';
import { Router } from '@angular/router';
import { UserInterface } from '../app-layout/user.interface';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  authService = inject(AuthService);
  router = inject(Router);
  API_BASE = 'http://10.0.11.147:3000';

  form = this.fb.nonNullable.group({
    emailId: ['', Validators.required],
    password: ['', Validators.required],
  });

  onSubmit(): void {
    const payload = this.form.getRawValue();
    console.log('Logging in with:', payload);
  
    this.http.post<{ token: string; user: UserInterface }>(
      `${this.API_BASE}/api/login`,
      payload
    ).subscribe({
      next: (response) => {
        console.log('Login response:', response);
  
        // Save token & user to sessionStorage
        sessionStorage.setItem('auth_token', response.token);
        sessionStorage.setItem('auth_user', JSON.stringify(response.user));
  
        // Update AuthService state
        this.authService.currentUserSig.set(response.user);
  
        // Navigate to chat
        this.router.navigateByUrl('/chat');
        location.reload()
      },
      error: (err) => {
        console.error('Login failed:', err);
        alert('Login failed. Check your credentials.');
      },
    });
  }
}
