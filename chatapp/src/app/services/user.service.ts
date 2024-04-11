import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { Firestore, collection, collectionData, doc, query, setDoc, updateDoc } from '@angular/fire/firestore';
import { Observable, from, of, switchMap } from 'rxjs';
import { UserProfile } from '../Models/user-profile';
import { docData } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})


export class UserService {

  get currentUserProfile$():Observable<UserProfile | null>{
    return this.authService.currentUser.pipe(
      switchMap(user=>{
        if(!user?.uid)
          return of(null);
        const ref=doc(this.firestore,'users',user?.uid)
         return docData(ref)as Observable<UserProfile>

      })

    )
  }

  constructor(private firestore:Firestore , private authService:AuthenticationService) { }
  
  addUser(user:UserProfile):Observable<any>{
    const ref=doc(this.firestore,'users',user?.uid);
    return from(setDoc(ref,user));
  }

  updateUser(user:UserProfile):Observable<any>{
      const ref=doc(this.firestore,'users',user?.uid);
      return from(updateDoc(ref,{...user}));
  }

  get allUsers():Observable<UserProfile[] | null>{
      const ref=collection(this.firestore,'users');
      const queryAll=query(ref);
      return collectionData(queryAll) as Observable<UserProfile[]>;
    }
}



