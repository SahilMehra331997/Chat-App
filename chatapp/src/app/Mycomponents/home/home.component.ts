import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule,FormGroup, FormsModule, FormControl } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { UserProfile } from '../../Models/user-profile';
import { combineLatest, map, startWith } from 'rxjs';
import { ChatsService } from '../../services/chats.service';
import{MatFormFieldModule} from '@angular/material/form-field';
import {MatListModule} from '@angular/material/list';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,MatFormFieldModule,MatListModule,MatOptionModule,],
  template: `
      <div class="container">
        <div class="chat-list">
          <div class="search-input">
            <select placeholder="Search for users...." [(ngModel)]="selectedUser" (change)="createChat(selectedUser)">
              <option value="" disabled selected>Select a user</option>
              <option *ngFor="let user of displayUser | async" [ngValue]="user">{{ user.displayName }}</option>
            </select>
         </div>
          
          <mat-selection-list [multiple]="false">
           <mat-list-option *ngFor="let chat of myChats | async" [value]="chat.id">
           <img class="img-account-profile rounded-circle " [src]="chat.users[0].photoURL || './assets/dp.png'" alt="" height="30px" width="30px">
              {{chat.chatName}}
           </mat-list-option>
          </mat-selection-list>
        </div>
        <div class='messages'>
            <div class="chat-heading">
              <img class="img-account-profile rounded-circle " src="./assets/dp.png" alt="" height="40px" width="40px">
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

  selectedUser!:UserProfile;
  
  user$=this.userService.currentUserProfile$;//current logged in user
  users=this.userService.allUsers;//all users

  myChats=this.chatService.myChats;
  
  searchControl=new FormControl('')

  displayUser=combineLatest([this.users,this.user$,this.searchControl.valueChanges.pipe(startWith(''))]).pipe(
    map(([users,user,searchString])=>users!.filter(u=>u.displayName?.toLowerCase().includes(searchString!.toLowerCase())&&u.uid!==user?.uid)));//user excluding current user

  constructor() { }
  ngOnInit(): void {
  }

  createChat(user:UserProfile) {
    this.chatService.createChat(user).subscribe();
    }  
}
