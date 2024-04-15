import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule,FormGroup, FormsModule, FormControl } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { UserProfile } from '../../Models/user-profile';
import { combineLatest, map, startWith } from 'rxjs';
import { ChatsService } from '../../services/chats.service';
import{MatFormFieldModule} from '@angular/material/form-field';




@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,MatFormFieldModule],
  template: `
      <div class="container">
        <div class="chat-list">
          <div class="search-input">
           <select matNativeControl placeholder="Search for users ...">
             <option value="" disabled selected>Select a user</option>
             <option *ngFor="let user of displayUser | async" [value]="user">{{user.displayName}}</option>
           </select>
          </div>
          <div class="user-list d-flex ms-2" *ngFor="let user of displayUser | async" (click)="selectedUser(user)">
          <img class="img-account-profile rounded-circle " src="./assets/dp.png" alt="" height="30px" width="30px">{{user.displayName}}
          </div>
        </div>
        <div class='messages'>
            <div class="chat-heading">
              <img class="img-account-profile rounded-circle " src="./assets/dp.png" alt="" height="40px" width="40px">{{user1}}
            </div>
          <div class="chat-body">
             
          </div>
        </div>
      </div>
  `,
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  private userService=inject(UserService);
  private chatService=inject(ChatsService);
  
  user1:string="";


  selectedUser(user:UserProfile){
    this.user1=user.displayName as string;

  }
  user$=this.userService.currentUserProfile$;//current logged in user
  users=this.userService.allUsers;//all users

  myChats=this.chatService.myChats;
  
  searchControl=new FormControl('')

  displayUser=combineLatest([this.users,this.user$,this.searchControl.valueChanges.pipe(startWith(''))]).pipe(
    map(([users,user,searchString])=>users!.filter(u=>u.displayName?.toLowerCase().includes(searchString!.toLowerCase())&&u.uid!==user?.uid)));//user excluding current user

  constructor() { }
  ngOnInit(): void {
  }

  createChat(user: UserProfile) {
     this.chatService.createChat(user).subscribe();

    }  
}
