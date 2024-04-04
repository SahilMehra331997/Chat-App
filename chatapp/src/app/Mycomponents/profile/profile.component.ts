import { Component } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { RouterLink } from '@angular/router';
import { User } from '@angular/fire/auth';
import { Observable, concatMap } from 'rxjs';
import { ImageUploadService } from '../../services/image-upload.service';
import { HotToastService } from '@ngneat/hot-toast';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink,CommonModule],
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
                    <img class="img-account-profile rounded-circle mb-2" [src]="user.photoURL ?? './assets/dp.png'" alt="" width=240 height=240>
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
  `,
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  user=this.auth.currentUser;
   constructor(private auth:AuthenticationService,private imageUploadService:ImageUploadService,private toast:HotToastService){}

   uploadImage(event: any, user:any) {
     this.imageUploadService.uploadImage(event.target.files[0],`images/profile/${user.uid}`).pipe(
      this.toast.observe({
        success:"Image uploaded",
        loading:"Image Uploading ",
        error:({message})=>`${message}`
        }),concatMap((photoURL)=>this.auth.updateProfileData({photoURL}))
     ).subscribe();
   }
}
