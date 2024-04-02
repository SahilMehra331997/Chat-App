import { CommonModule , } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink ,Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { HotToastService } from '@ngneat/hot-toast';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink,FormsModule,ReactiveFormsModule,CommonModule],
  template: `
 <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.min.css" integrity="sha512-1PKOgIY59xJ8Co8+NE6FZ+LOAZKjy+KY8iq0G4B3CyeY6wYHN3yt9PW0XpSriVlkMXe40PTKnXrLnZ9+fkDaog==" crossorigin="anonymous" />

<div class="container-fluid">
    <div class="row main-content bg-success text-center">
        <div class="col-md-4 text-center company__info">
            <span class="company__logo"><h2><i class="fas fa-comment fa-3x"></i></h2></span>
        </div>
        <div class="col-md-8 col-xs-12 col-sm-12 login_form ">
            <div class="container-fluid">
                <div class="row">
                    <h2>Log In</h2>
                </div>
                <div class="row">
                    <form [formGroup]="loginForm" class="form-group" (ngSubmit)="Submit()">
                        <div class="row">
                            <input type="text" formControlName="email" id="username" class="form__input" placeholder="Username/Email">
                            <span *ngIf="loginForm && loginForm.get('email')?.invalid && (loginForm.get('email')?.dirty || loginForm.get('email')?.touched)" class="invalid-feedback">
                                <i class="fas fa-exclamation-circle"></i>
                                <span *ngIf="loginForm && loginForm.get('email')?.errors?.['required']">Email is required.</span>
                                <span *ngIf="loginForm && loginForm.get('email')?.errors?.['email']">Invalid email format.</span>
                            </span>
                        </div>
                        <div class="row">
                            <input type="password" formControlName="password" id="password" class="form__input" placeholder="Password">
                            <span *ngIf="loginForm && loginForm.get('password')?.invalid && (loginForm.get('password')?.dirty || loginForm.get('password')?.touched)" class="invalid-feedback">
                                <i class="fas fa-exclamation-circle"></i>
                                <span *ngIf="loginForm && loginForm.get('password')?.errors?.['required']">Password is required.</span>
                                <span *ngIf="loginForm && loginForm.get('password')?.errors?.['minlength']">Password must be at least 6 characters long.</span>
                            </span>
                        </div>
                        <div class="row">
                            <input type="submit" value="Submit" class="btn" [disabled]="loginForm.invalid">
                        </div>
                    </form>
                </div>
                <div class="row">
                    <p>Don't have an account? <a routerLink="/sign-up">Register Here</a></p>
                </div>
            </div>
        </div>
    </div>
</div>


  `,
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

    constructor(private authService:AuthenticationService,private router:Router,private toast:HotToastService)
     {}

    loginForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      });
    
      get email() { return this.loginForm.get('email'); }
      get password() { return this.loginForm.get('password'); }

      ngOnInit(): void {}

      Submit() {
        if(!this.loginForm.valid)
          return;
        const {email,password} = this.loginForm.value;
        this.authService.login(email!,password!).pipe(this.toast.observe({
                 success:"Logged in successfully",
                 loading:"Logging in...",
                 error:'Invalid username or password'
               }))
        .subscribe((res)=>{
             this.router.navigate(['/home'])
         })
        }
    
}
