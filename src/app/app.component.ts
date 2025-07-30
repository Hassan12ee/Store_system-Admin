import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { AuthService } from './shared/services/auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet ,RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'freshcart';
    constructor(public _AuthService:AuthService) { }
    isLogin : boolean = false;
    name: string = " " ;
    role: string = " " ;
    ngOnInit(): void {
      this._AuthService.userData.subscribe(() => {
        if(this._AuthService.userData.getValue() != null) {
          this.isLogin = true;
          this.name = localStorage.getItem("Name") || "";
          
        }
        else {
          this.isLogin = false;
        }
      })
    }
}
