import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule,FormGroup, FormsModule, FormControl } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { UserProfile } from '../../Models/user-profile';
import { Observable, combineLatest, map, startWith, switchMap } from 'rxjs';
import { ChatsService } from '../../services/chats.service';
import{MatFormFieldModule} from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,MatFormFieldModule,MatOptionModule,MatSelectModule,MatInputModule],
  template: `
      <div class="container">
        <div class="chat-list">
          <div class="search-input">
            <!-- <select [(ngModel)]="selectedUser" (change)="createChat(selectedUser)" ngDefaultControl >
              <option value="" disabled selected>Select a user</option>
              <option *ngFor="let user of displayUser | async" [ngValue]="user">{{ user.displayName }}</option>
            </select> -->
            <select [(ngModel)]="selectedUser" (ngModelChange)="createChat(selectedUser)">
              <option value="" disabled selected>Select a user</option>
              <option *ngFor="let user of displayUser | async" [ngValue]="user">{{ user.displayName }}</option>
            </select>
          </div>
          <div>
            <ul>
              <li class="user-list" *ngFor="let chat of myChats | async" (click)="selectChat(chat.id)">
                  <img class="img-account-profile rounded-circle" [src]="chat.chatPic || './assets/dp.png'" alt="" height="45px" width="45px">
                  {{ chat.chatName }}
              </li>
            </ul>
         </div>
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
          <div class="chat-body" *ngIf="display">
            <div class="chat-area">
              <div  class =chat-bubble-container *ngFor="let message of messages$ | async">
                 <div class="chat-bubble">{{message.text}}
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
export class HomeComponent {
  display:boolean=false;
  private userService=inject(UserService);
  private chatService=inject(ChatsService);
  selectedChat$: Observable<any>;

  searchControl=new FormControl('');
  chatListControl=new FormControl('');
  messageControl=new FormControl('');
  selectedUser:any='';
  user$=this.userService.currentUserProfile$;//current logged in user
  users=this.userService.allUsers;//all users

  myChats=this.chatService.myChats;

  selectChat(chatId: string) {
    this.chatListControl.setValue(chatId);
    this.display=true;
  }
  
  displayUser=combineLatest([this.users,this.user$,this.searchControl.valueChanges.pipe(startWith(''))]).pipe(
    map(([users,user,searchString])=>users!.filter(u=>u.displayName?.toLowerCase().includes(searchString!.toLowerCase())&&u.uid!==user?.uid)));//user excluding current user


  messages$=this.chatListControl.valueChanges.pipe(
     map((value)=>value!),
     switchMap(chatId=>this.chatService.getChatMessages$(chatId))
  )

  constructor() { 
    this.selectedChat$=combineLatest([this.chatListControl.valueChanges,this.myChats]).pipe(map(([value,Chats])=>Chats.find(c=>c.id===value)))
      
  }

  sendMessage() {
    const message=this.messageControl.value;
    const selectedChatId=this.chatListControl.value;
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
