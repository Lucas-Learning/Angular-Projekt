import { Routes } from '@angular/router';
import { AppLayout } from './app-layout/app-layout';
import { Login } from './login/login';
import { Signup } from './signup/signup';
import { Chat } from './chat/chat';
import { inject } from '@angular/core';
import { AuthService } from './app-layout/auth.service';
import { Router } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    component: AppLayout,
    canActivate: [() => {
      const authService = inject(AuthService);
      const router = inject(Router);
      if (authService.currentUserSig()) {
        router.navigateByUrl('/chat');
        return false;
      }
      return true;
    }]
  },
  {
    path: 'chat',
    component: Chat,
    canActivate: [() => {
      const authService = inject(AuthService);
      const router = inject(Router);
      if (!authService.currentUserSig()) {
        router.navigateByUrl('/login');
        return false;
      }
      return true;
    }]
  },
  {
    path: 'login',
    component: Login,
    canActivate: [() => {
      const authService = inject(AuthService);
      const router = inject(Router);
      if (authService.currentUserSig()) {
        router.navigateByUrl('/chat');
        return false;
      }
      return true;
    }]
  },
  {
    path: 'signup',
    component: Signup,
    canActivate: [() => {
      const authService = inject(AuthService);
      const router = inject(Router);
      if (authService.currentUserSig()) {
        router.navigateByUrl('/chat');
        return false;
      }
      return true;
    }]
  }
];