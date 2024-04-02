import { Routes } from '@angular/router';
import { LandingComponent } from './Mycomponents/landing/landing.component';
import { SignUpComponent } from './Mycomponents/sign-up/sign-up.component';
import { HomeComponent } from './Mycomponents/home/home.component';
import { LoginComponent } from './Mycomponents/login/login.component';

export const routes: Routes = [{path:"",pathMatch:"full",component:LandingComponent},
                               {path:"sign-up",component:SignUpComponent},
                               {path:"login",component:LoginComponent},
                                {path:"home",component:HomeComponent}];
