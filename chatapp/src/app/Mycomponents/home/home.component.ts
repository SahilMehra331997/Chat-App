import { Component } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule,FormGroup, FormsModule, FormControl } from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  template: `
      <div class="container">
        <div class="chat-list">
          <input type="text" formControlName="SearchUser" class="form__input" placeholder="Search for user...">
        </div>
        <div class='messages'>
        </div>
      </div>
  `,
  styleUrl: './home.component.css'
})
export class HomeComponent {  

  form1=new FormGroup({
    name:new FormControl(''),
  })
  constructor(private authService: AuthenticationService) { }
}
