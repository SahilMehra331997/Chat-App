import { Routes } from '@angular/router';
import { LandingComponent } from './Mycomponents/landing/landing.component';
import { SignUpComponent } from './Mycomponents/sign-up/sign-up.component';
import { HomeComponent } from './Mycomponents/home/home.component';
import { LoginComponent } from './Mycomponents/login/login.component';
import { canActivate, redirectUnauthorizedTo,redirectLoggedInTo } from '@angular/fire/auth-guard';
import { ProfileComponent } from './Mycomponents/profile/profile.component';

const redirectToLogin=()=>redirectUnauthorizedTo(['login']);
const redirectToHome=()=>redirectLoggedInTo(['home']);

export const routes: Routes = [{path:"",pathMatch:"full",component:LandingComponent},
                               {path:"sign-up",component:SignUpComponent,...canActivate(redirectToHome)},
                               {path:"login",component:LoginComponent,...canActivate(redirectToHome)},
                                {path:"home",component:HomeComponent,...canActivate(redirectToLogin)},
                                {path:"profile",component:ProfileComponent,...canActivate(redirectToLogin)}];
