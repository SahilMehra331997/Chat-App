import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule,FormGroup, FormsModule, FormControl } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { UserProfile } from '../../Models/user-profile';
import { combineLatest, map, startWith, switchMap } from 'rxjs';
import { ChatsService } from '../../services/chats.service';
import{MatFormFieldModule} from '@angular/material/form-field';
import {MatListModule} from '@angular/material/list';
import { MatOptionModule } from '@angular/material/core';
import {MatIconModule} from '@angular/material/icon'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,MatFormFieldModule,MatListModule,MatOptionModule,MatIconModule],
  template: `
      <div class="container">
        <div class="chat-list">
          <div class="search-input">
            <select placeholder="Search for users...." [(ngModel)]="selectedUser" (change)="createChat(selectedUser)">
              <option value="" disabled selected>Select a user</option>
              <option *ngFor="let user of displayUser | async" [ngValue]="user">{{ user.displayName }}</option>
            </select>
         </div>
          
          <mat-selection-list [multiple]="false" [formControl]='chatListControl'>
           <mat-list-option *ngFor="let chat of myChats | async" [value]="chat.id">
           <img class="img-account-profile rounded-circle " [src]="chat.chatPic || './assets/dp.png'" alt="" height="30px" width="30px">
              {{chat.chatName}}
           </mat-list-option>
          </mat-selection-list>
        </div>
        <div class='messages'>
            <div class="chat-heading" *ngIf="selectedChat$ | async as selectedChat;else noMessage">
              <img class="img-account-profile rounded-circle " [src]="selectedChat.chatPic || './assets/dp.png'" alt="" height="40px" width="40px">
              <h2>{{selectedChat.chatName}}</h2>
            </div>
            <ng-template #noMessage>
            <div class="chat-heading"><h2>Messages</h2>
            </div>
            </ng-template>
          <div class="chat-body">
            <div class="chat-area">
              <div  class =chat-bubble-container *ngFor="let message of messages$ | async">
                 <div class="chat-bubble">
                   {{message.text}}
                   <span class="chat-date">{{message.sentDate}}</span>
                 </div>
              </div>
            </div>
            <div class="input-area">
               <input matInput [formControl]="messageControl" placeholder="Enter your message."/>
               <button (click)="sendMessage()"><i class="fas fa-caret-right"></i>send</button>
            </div>
          </div>
        </div>
      </div>
  `,
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  private userService=inject(UserService);
  private chatService=inject(ChatsService);

  searchControl=new FormControl('');
  chatListControl=new FormControl('');
  messageControl=new FormControl('');

  selectedUser!:UserProfile;
  
  user$=this.userService.currentUserProfile$;//current logged in user
  users=this.userService.allUsers;//all users

  myChats=this.chatService.myChats;
  selectedChat$=combineLatest([this.chatListControl.valueChanges,this.myChats]).pipe(map(([value,Chats])=>Chats.find(c=>c.id===value![0])))
  
 

  displayUser=combineLatest([this.users,this.user$,this.searchControl.valueChanges.pipe(startWith(''))]).pipe(
    map(([users,user,searchString])=>users!.filter(u=>u.displayName?.toLowerCase().includes(searchString!.toLowerCase())&&u.uid!==user?.uid)));//user excluding current user


  messages$=this.chatListControl.valueChanges.pipe(
     map((value)=>value![0]),
     switchMap(chatId=>this.chatService.getChatMessages$(chatId))
  )

  constructor() { }
  ngOnInit(): void {
  }

  sendMessage() {
    const message=this.messageControl.value;
    const selectedChatId=this.chatListControl.value![0];
    if(message && selectedChatId)
      {
        this.chatService.addChatMessage(selectedChatId, message).subscribe()
        this.messageControl.setValue('');
      }
    }

  createChat(user:UserProfile) {
    this.chatService.createChat(user).subscribe();
    }  
}
