import { Component } from '@angular/core';
import { RouterLink, RouterOutlet ,Router} from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,RouterLink,CommonModule,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'chatapp';
  constructor(public authService:AuthenticationService,private router:Router){}
  
  logout(){
    this.authService.logout().subscribe(()=>{
        this.router.navigate(['']);
    })
  }
}
