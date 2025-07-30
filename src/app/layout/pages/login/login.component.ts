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

  loginForm:FormGroup = new FormGroup({
    email : new FormControl(null,[Validators.required,Validators.email]),
    password : new FormControl(null,Validators.required,),
  })
  submitlogin(){this.isLoading = true;
    if(this.loginForm.valid){
      //connect api
      this._AuthService.signIn(this.loginForm.value).subscribe({
        next:(res)=>{
          this.isLoading = false;
          localStorage.setItem("userToken",`bearer ${res.token}`);
          localStorage.setItem("have_address",res.employee.roles);
          localStorage.setItem("email_verified_at",res.employee.email_verified_at);
          localStorage.setItem("email",res.employee.email);
          localStorage.setItem("Name",`${res.employee.FristName} ${res.employee.LastName}`);
          this._AuthService.deCodeUserData();
          if(res.employee.email_verified_at==null)
            {
              this._Router.navigate(["/verifyEmail"]);
            }
            else{
              this._Router.navigate(["/Home"]);
            }


        },
        error:(err) => {

          this.isLoading = false;
          this.errmsg = err.error.message;
        }
      });
    }
  }
}
