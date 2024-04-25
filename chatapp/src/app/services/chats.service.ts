import { Injectable } from '@angular/core';
import { Firestore, Timestamp, addDoc, collectionData, doc, orderBy, query, updateDoc, where } from '@angular/fire/firestore';
import { Observable, concatMap, map, take } from 'rxjs';
import { UserProfile } from '../Models/user-profile';
import { collection } from '@firebase/firestore';
import { UserService } from './user.service';
import { Chat, messages } from '../Models/chat';

@Injectable({
  providedIn: 'root'
})
export class ChatsService {
  
  constructor(private firestore:Firestore , private userService:UserService) { }

  createChat(otherUser:UserProfile):Observable<string>{
    const ref=collection(this.firestore,'Chats');
    return this.userService.currentUserProfile$.pipe(
      take(1),
      concatMap(user=>addDoc(ref,{
        userIds:[user?.uid,otherUser?.uid],
        users:[
          {displayName:user?.displayName??'',photoURL:user?.photoURL??''},
          {displayName:otherUser?.displayName??'',photoURL:otherUser?.photoURL??''}]
      })),
      map(ref => ref.id)
    )
  }

  get myChats():Observable<Chat[]>{
     const ref=collection(this.firestore,'Chats')        
    return this.userService.currentUserProfile$.pipe(
      concatMap((user)=>{
        const myQuery=query(ref,where('userIds','array-contains',user?.uid))
        return collectionData(myQuery,{idField:'id'}).pipe(
          map(chats=>this.addChatNameAndPic(user?.uid!,chats as Chat[]))
        ) 
      })
    )
  }

   addChatNameAndPic(currentUserId:string,chats:Chat[]):Chat[]{
     chats.forEach(chat=>{
      const otherIndex=chat.userIds.indexOf(currentUserId) === 0 ? 1 : 0;
      const {displayName,photoURL}=chat.users[otherIndex]
       chat.chatName=displayName;
       chat.chatPic=photoURL;
     })
     return chats;
   }

   addChatMessage(chatId:string,message:string):Observable<any>{
    const ref=collection(this.firestore,'Chats',chatId,'messages');
    const chatRef=doc(this.firestore,'Chats',chatId);
    const today=Timestamp.fromDate(new Date()); 
    return this.userService.currentUserProfile$.pipe(
      take(1),
      concatMap((user)=>addDoc(ref,{
        text:message,
        senderId:user?.uid,
        sentDate:today
      })),
      concatMap(()=>updateDoc(chatRef,{lastMessage:message, lastMessageDate:today}))
    )
   }

   getChatMessages$(chatId:string):Observable<messages[]>{
    const ref=collection(this.firestore,'Chats',chatId,'messages');
    const queryAll=query(ref,orderBy('sentDate','asc'))
    return collectionData(queryAll) as Observable<messages[]>
   }

}
