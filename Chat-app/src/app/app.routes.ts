import { Routes } from '@angular/router';
import { LandingComponent } from './MyComponents/landing/landing.component';
import { SignUpComponent } from './MyComponents/sign-up/sign-up.component';
import { LoginComponent } from './MyComponents/login/login.component';
import { HomeComponent } from './MyComponents/home/home.component';

export const routes: Routes = [{path:"",pathMatch:"full",component:LandingComponent},
                               {path:"sign-up",component:SignUpComponent},
                               {path:"login",component:LoginComponent},
                               {path:"home",component:HomeComponent}
                            ];
