import { Injectable } from '@angular/core';
import { Firestore, addDoc, collectionData, query, where } from '@angular/fire/firestore';
import { Observable, concatMap, map, take } from 'rxjs';
import { UserProfile } from '../Models/user-profile';
import { collection } from '@firebase/firestore';
import { UserService } from './user.service';
import { Chat } from '../Models/chat';

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
          {displayName:user?.displayName??'',photoURl:user?.photoURL??''},
          {displayName:otherUser?.displayName??'',photoURl:otherUser?.photoURL??''}]
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
      const {displayName , photoURL}=chat.users[otherIndex]
       chat.chatName=displayName;
       chat.chatPic=photoURL;
     })
     return chats;
   }

}
