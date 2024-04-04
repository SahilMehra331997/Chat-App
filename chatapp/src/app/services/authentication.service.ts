import { Injectable } from '@angular/core';
import { Auth, UserInfo, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from '@angular/fire/auth';
import { Observable, concat, concatMap, from, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  currentUser=authState(this.auth);
  constructor(private auth : Auth) { }
  
  login(username:string,password:string){
     return from(signInWithEmailAndPassword(this.auth,username,password));
  }

  logout(){
    return from(this.auth.signOut());
  }

  signUp(name:string,email:string,password:string){
     return from(createUserWithEmailAndPassword(this.auth,email,password)).pipe(switchMap(({user})=>updateProfile(user,{displayName:name})))
  }

  updateProfileData(profileData:Partial<UserInfo>):Observable<any>{
    const user=this.auth.currentUser;
    return of(user).pipe(
      concatMap((user)=>{
        if(!user) throw new Error('Not Authenticated')
        return updateProfile(user,profileData);
      })
    )
  }
}
