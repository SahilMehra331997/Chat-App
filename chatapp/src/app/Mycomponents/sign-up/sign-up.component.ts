import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit,ViewChild} from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { HotToastService } from '@ngneat/hot-toast';
import { Router } from '@angular/router';

export function passwordsMatchValidator():ValidatorFn {
  return (control:AbstractControl):ValidationErrors|null=>{
    const password=control.get('password')?.value;
    const confirmPassword=control.get('confirmPassword')?.value;
    if(password && confirmPassword && password !== confirmPassword)
        return {passwordDontMatch:true}
    return null
  }
}

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [FormsModule,CommonModule,ReactiveFormsModule],
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
                    <h2>Sign Up!</h2>
                </div>
                <div class="row">
                    <form [formGroup]="signUpForm" class="form-group" (ngSubmit)="Submit()">
                         <!-- name -->
                        <div class="row">
                            <input type="text" formControlName="name" id="username" class="form__input" placeholder="Username">
                            <span  *ngIf="signUpForm && signUpForm.get('name')?.invalid && (signUpForm.get('name')?.dirty || signUpForm.get('name')?.touched)" class="invalid-feedback">
                                <i class="fas fa-exclamation-circle"></i>
                                <span *ngIf="signUpForm && signUpForm.get('name')?.errors?.['required']">Name is required.</span>
                                <span *ngIf="signUpForm && signUpForm.get('name')?.errors?.['pattern']">Invalid username.</span>
                            </span>
                        </div>
                        <!-- email -->
                        <div class="row">
                            <input type="text" formControlName="email" id="email" class="form__input" placeholder="Email Address">
                            <span *ngIf="signUpForm && signUpForm.get('email')?.invalid && (signUpForm.get('email')?.dirty || signUpForm.get('email')?.touched)" class="invalid-feedback">
                                <i class="fas fa-exclamation-circle"></i>
                                <span *ngIf="signUpForm && signUpForm.get('email')?.errors?.['required']">Email is required.</span>
                                <span *ngIf="signUpForm && signUpForm.get('email')?.errors?.['email']">Invalid email format.</span>
                            </span>
                        </div>
                        <!-- phone number -->
                        <div class="row" id="phonefield">
                            <input type="text" formControlName="phone" id="phone" class="form__input" placeholder="Phone number" #phoneInput>
                            <span *ngIf="signUpForm && signUpForm.get('phone')?.invalid && (signUpForm.get('phone')?.dirty || signUpForm.get('phone')?.touched)" class="invalid-feedback">
                                <i class="fas fa-exclamation-circle"></i>
                                <span *ngIf="signUpForm && signUpForm.get('phone')?.errors?.['required']">Phone number is required.</span>
                                <span *ngIf="signUpForm && signUpForm.get('phone')?.errors?.['pattern']">Invalid Phone number.</span>
                            </span>
                        </div>
                        <!-- password -->
                        <div class="row">
                            <input type="password" formControlName="password" id="password" class="form__input" placeholder="Password">
                            <span *ngIf="signUpForm && signUpForm.get('password')?.invalid && (signUpForm.get('password')?.dirty || signUpForm.get('password')?.touched)" class="invalid-feedback">
                                <i class="fas fa-exclamation-circle"></i>
                                <span *ngIf="signUpForm && signUpForm.get('password')?.errors?.['required']">Password is required.</span>
                                <span *ngIf="signUpForm && signUpForm.get('password')?.errors?.['minlength']">Password must be at least 6 characters long.</span>
                            </span>
                        </div>
                        <!-- confirmPassword -->
                        <div class="row">
                            <input type="password" formControlName="confirmPassword" id="confirmPassword" class="form__input" placeholder="Confirm Password">
                            <span *ngIf="signUpForm && signUpForm.get('confirmPassword')?.invalid && (signUpForm.get('confirmPassword')?.dirty || signUpForm.get('confirmPassword')?.touched)" class="invalid-feedback">
                                <i class="fas fa-exclamation-circle"></i>
                                <span *ngIf="signUpForm && signUpForm.get('confirmPassword')?.errors?.['required']">Password Confirmation is required.</span>
                                <span *ngIf="signUpForm && signUpForm.get('confirmPassword')?.errors?.['minlength']">confirmPassword must be at least 6 characters long.</span>
                            </span>
                        </div>
                        <div class="row">
                          <span class="invalid-feedback" *ngIf="signUpForm && signUpForm.errors?.['passwordDontMatch']"><i class="fas fa-exclamation-circle"></i>Password dont match!!</span>
                        </div>
                        <div class="row ms-3">
                         <input type="submit" value="Submit" class="btn" [disabled]="signUpForm.invalid">
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
  `,
  styleUrl: './sign-up.component.css'
})

export class SignUpComponent implements OnInit {

  constructor(private authService:AuthenticationService,private toast:HotToastService,private router:Router){}

  signUpForm = new FormGroup({
     name: new FormControl('', [Validators.required,Validators.pattern("^[A-Za-z][A-Za-z0-9]{2,10}$")]),
     email: new FormControl('', [Validators.required, Validators.email]),
     phone: new FormControl('', [Validators.required, Validators.pattern("^[0-9]{10}$")]),
     password: new FormControl('', [Validators.required, Validators.minLength(6)]),
     confirmPassword: new FormControl('', Validators.required),
     },{validators:passwordsMatchValidator()});
   
  ngOnInit(): void {}
  Submit() {
    if(!this.signUpForm.valid)
      return;
    const {name,email,password} = this.signUpForm.value;
    this.authService.signUp(name!,email!,password!).pipe(this.toast.observe({
             success:"Signed in successfully",
             loading:"Signing you in...",
             error:({message})=>`${message}`
           }))
    .subscribe(()=>{
         this.router.navigate(['/home'])
     })
    }
  get name() { return this.signUpForm.get('name'); }
    get email() { return this.signUpForm.get('email'); }
      get password() { return this.signUpForm.get('password'); }
      get confirmPassword() { return this.signUpForm.get('confirmPassword'); }
      
}

