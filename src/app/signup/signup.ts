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

  form = this.fb.nonNullable.group({
    emailId: ['', Validators.required],
    fullName: ['', Validators.required],
    password: ['', Validators.required],
  });
  onSubmit(): void {
    this.http.post('http://localhost:3000/api/register', {
  emailId: 'test@example.com',
  fullName: 'Test User',
  password: '123456'
});
    console.log(this.form.getRawValue())
    this.http
    
      .post<{ user: UserInterface }>('http://localhost:3000/api/register', 
        this.form.getRawValue(),
      )
      .subscribe((response) => {
        console.log('response', response);
        this.authService.currentUserSig.set(response.user);
        this.router.navigateByUrl('/');
      });
  }
}

