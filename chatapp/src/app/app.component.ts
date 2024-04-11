import { Component } from '@angular/core';
import { RouterLink, RouterOutlet ,Router} from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { CommonModule } from '@angular/common';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,RouterLink,CommonModule,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Chat-App';
 
   user=this.userService.currentUserProfile$; 

  constructor(private authService:AuthenticationService,private router:Router,private userService:UserService){}
  
  logout(){
    this.authService.logout().subscribe(()=>{
        this.router.navigate(['']);
    })
  }
}
