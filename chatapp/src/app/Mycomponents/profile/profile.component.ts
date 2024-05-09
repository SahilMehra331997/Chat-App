import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { RouterLink } from '@angular/router';
import { User } from '@angular/fire/auth';
import { Observable, concatMap } from 'rxjs';
import { ImageUploadService } from '../../services/image-upload.service';
import { HotToastService } from '@ngneat/hot-toast';
import { CommonModule } from '@angular/common';
import { UserProfile } from '../../Models/user-profile';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink,CommonModule,ReactiveFormsModule],
  template: `
  <div class="container-xl px-4 mt-4 ">
    <div class="row">
      <a routerLink="/home">Back</a>
        <div class="col-xl-4">
            <!-- Profile picture card-->
            <div class="card mb-4 mb-xl-0" *ngIf="user | async as user">
                <div class="card-header text-center">Profile Picture</div>
                <div class="card-body text-center">
                    <!-- Profile picture image-->
                    <img class="img-account-profile rounded-circle mb-2" [src]="user.photoURL || './assets/dp.png'" alt="" width=240 height=240>
                    <!-- Profile picture help block-->
                    <div class="small font-italic text-muted mb-4">JPG or PNG no larger than 5 MB</div>
                    <!-- Profile picture upload button-->
                    <button class="btn btn-primary" type="button" (click)="inputField.click()">Upload new image</button>
                </div>
                <input #inputField type="file" hidden (change)="uploadImage($event,user)">
            </div>
        </div>
     </div>
  </div>
  <div class="container-l">
		<div class="col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-12 col-xs-12 edit_information">
			<form [formGroup]="profileForm"  method="POST" (ngSubmit)="onSubmit()">	
				<h3 class="text-center mt-4 fw-bold">Edit Personal Information</h3>
        <div class="row">
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
						<div class="form-group">
							<input type="text" name="displayName" class="form-control" formControlName="displayName" placeholder="Display Name" required>
						</div>
					</div>
        </div>
				<div class="row">
					<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
						<div class="form-group">
							<input type="text" name="first_name" class="form-control" formControlName="firstName" placeholder="First Name" required >
						</div>
					</div>
					<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
						<div class="form-group">
							<input type="text" name="last_name" class="form-control" formControlName="lastName" placeholder="Last Name" required>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
						<div class="form-group">
							<input type="email" name="email" class="form-control" formControlName="email"  placeholder="Email" required>
						</div>
					</div>
					<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
						<div class="form-group">
							<input type="tel" name="phone" class="form-control" placeholder="Phone" formControlName="phone" required pattern=[0-9]{10}>
						</div>
					</div>
				</div>
        <div class="row">
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
						<div class="form-group">
							<input type="text" name="address" class="form-control" formControlName="address" placeholder="Address" required>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col-lg-8 col-md-8 col-sm-8 col-xs-12 submit">
						<div class="form-group">
							<input type="submit" class="btn btn-success mt-3" value="Submit">
						</div>
					</div>
				</div>
			</form>
		</div>
	</div>
  `,
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{


  user=this.userService.currentUserProfile$;
  
  profileForm = new FormGroup({
    uid:new FormControl(''),
    email:new FormControl(''),
    displayName:new FormControl(''),
    photoURL:new FormControl(''),
    firstName:new FormControl(''),
    lastName:new FormControl(''),
    phone:new FormControl(''),
    address:new FormControl(''),
  })

   constructor(private auth:AuthenticationService,private imageUploadService:ImageUploadService,private toast:HotToastService,private userService:UserService){}
  
   ngOnInit(): void {
    this.userService.currentUserProfile$.pipe(untilDestroyed(this)).subscribe((user)=>{
      this.profileForm.patchValue({...user})
    })
  }

   uploadImage(event: any, user:UserProfile) {
     this.imageUploadService.uploadImage(event.target.files[0],`images/profile/${user.uid}`).pipe(
      this.toast.observe({
        success:"Image uploaded",
        loading:"Image Uploading in the file",
        error:({message})=>`${message}`
        }),concatMap((photoURL)=>this.userService.updateUser({uid:user?.uid , photoURL}))
     ).subscribe();
   }

   onSubmit() {
    const profileData=this.profileForm.value;
    this.userService.updateUser(<UserProfile>profileData).pipe(this.toast.observe({
        success:"Profile updated",
        loading:"Updating Profile...",
        error:({message})=>`${message}`
    })).subscribe();
    }
}
