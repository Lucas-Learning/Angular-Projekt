import { Injectable, signal } from '@angular/core';
import { UserInterface } from './user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUserSig = signal<UserInterface | null>(null);

  constructor() {
    this.loadUserFromSession();
  }

  loadUserFromSession() {
    const userJson = sessionStorage.getItem('auth_user');
    if (userJson) {
      try {
        const user: UserInterface = JSON.parse(userJson);
        this.currentUserSig.set(user);
      } catch (err) {
        console.error('Invalid user data in sessionStorage');
        this.currentUserSig.set(null);
      }
    }
  }

  logout() {
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_user');
    this.currentUserSig.set(null);
  }

  getToken(): string | null {
    return sessionStorage.getItem('auth_token');
  }
}
