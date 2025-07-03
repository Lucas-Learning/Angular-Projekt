import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserInterface } from '../app-layout/user.interface';
import { AuthService } from '../app-layout/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.scss'
})
export class Signup {
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  authService = inject(AuthService);
  router = inject(Router);
  API_BASE = 'http://10.0.11.4:3000';

  form = this.fb.nonNullable.group({
    emailId: ['', Validators.required],
    fullName: ['', Validators.required],
    password: ['', Validators.required],
  });
  onSubmit(): void {
   
    console.log(this.form.getRawValue())
    this.http
      .post<{ user: UserInterface }>(`${this.API_BASE}/api/register`, 
        this.form.getRawValue(),
      )
      .subscribe((response) => {
        console.log('response', response);
        this.authService.currentUserSig.set(response.user);
        this.router.navigateByUrl('/');
      });
      this.http
      .get<{ users: UserInterface[] }>('/api/getusers')
      .subscribe({
        next: (response) => {
          console.log('response', response);
          if(response.users.length > 0){
            this.authService.currentUserSig.set(response.users[0]);
          }
          else{
            this.authService.currentUserSig.set(null);
          }
        },
        error: () => {
          this.authService.currentUserSig.set(null);
        },
      });
  }
}

