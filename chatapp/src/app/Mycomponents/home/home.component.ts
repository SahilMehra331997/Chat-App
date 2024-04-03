import { Component } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h3 *ngIf="user | async as user">Welcome {{user.displayName}}!</h3>
  `,
  styleUrl: './home.component.css'
})
export class HomeComponent {
  user = this.authService.currentUser;
  constructor(private authService: AuthenticationService) { }
}
