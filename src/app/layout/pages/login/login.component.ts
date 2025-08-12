import { Component , OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FlowbiteService } from '../../../shared/services/flowbite/flowbite.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule , RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit  {
  constructor(private _AuthService:AuthService , private _Router:Router ,private _FlowbiteService:FlowbiteService){}

  ngOnInit(): void {
    this._FlowbiteService.loadFlowbite(flowbite => {
      // Your custom code here
      console.log('Flowbite loaded', flowbite);
    });
  }
  isLoading:boolean = false;
  errmsg !:string;

  loginForm: FormGroup = new FormGroup({
    login: new FormControl(null, [
      Validators.required,
      (control) => {
        const value = control.value;
        if (!value) return null;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phonePattern = /^01[0-2,5]{1}[0-9]{8}$/; // Egyptian phone numbers
        if (emailPattern.test(value) || phonePattern.test(value)) {
          return null;
        }
        return { loginInvalid: true };
      }
    ]),
    password: new FormControl(null, Validators.required),
  })
  submitlogin(){this.isLoading = true;
    if(this.loginForm.valid){
      //connect api
      this._AuthService.signIn(this.loginForm.value).subscribe({
        next:(res)=>{
          this.isLoading = false;
          localStorage.setItem("userToken",`bearer ${res.token}`);
          localStorage.setItem("have_address",res.roles);
          localStorage.setItem("email_verified_at",res.user.email_verified_at);
          localStorage.setItem("email",res.user.email);
          localStorage.setItem("Name",`${res.user.FristName} ${res.user.LastName}`);
          this._AuthService.deCodeUserData();
          if(res.user.email_verified_at==null)
            {
              this._Router.navigate(["/verifyEmail"]);
            }
            else{
              this._Router.navigate(["/Home"]);
            }


        },
        error:(err) => {

          this.isLoading = false;
          this.errmsg = err.error.error || 'An error occurred during login. Please try again.';
          console.error('Login error:', err);
        }
      });
    }
  }
}
