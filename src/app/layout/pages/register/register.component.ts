import { Component , OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup , ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { Router } from '@angular/router';
import { FlowbiteService } from '../../../shared/services/flowbite/flowbite.service';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  constructor(private _AuthService:AuthService , private _Router:Router ,private _FlowbiteService:FlowbiteService){}

  ngOnInit(): void {
    this._FlowbiteService.loadFlowbite(flowbite => {
      // Your custom code here
      console.log('Flowbite loaded', flowbite);
    });
  }

  errmsg !:string;
  isLoading:boolean = false;
  registerForm:FormGroup = new FormGroup({
    FristName : new FormControl(null ,[Validators.required ,Validators.minLength(3),Validators.maxLength(16)]),
    LastName : new FormControl(null ,[Validators.required ,Validators.minLength(3),Validators.maxLength(16)]),
    Gender : new FormControl(null ,[Validators.required,Validators.pattern(/^(Male|Female)$/)]),
    Birthday : new FormControl(null ,[Validators.required]),
    email : new FormControl(null,[Validators.required,Validators.email]),
    password : new FormControl(null, [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)]),
    rePassword : new FormControl(null,Validators.required,),
    Phone : new FormControl(null , [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]),
  },this.checkRepasswordMatch)

  checkRepasswordMatch(g:AbstractControl) {
    if( g.get('password')?.value === g.get("rePassword")?.value)
      {
        return null;
      }
      else{
        g.get('rePassword')?.setErrors({mismatch:true})
        return {mismatch:true};
      }
  }

  submitRegister(){
    this.isLoading = true;
    if(this.registerForm.valid){
      //connect api
      this._AuthService.signUp(this.registerForm.value).subscribe({
        next:(res)=>{
          this.isLoading = false;
          console.log(res);
          localStorage.setItem("userToken",`bearer ${res.token}`);
          localStorage.setItem("have_address",res.user.have_address);
          localStorage.setItem("email_verified_at",res.user.email_verified_at);
          localStorage.setItem("email",res.user.email);
          localStorage.setItem("FristName",res.user.FristName);
          this._AuthService.deCodeUserData();
          this._Router.navigate(["/verifyEmail"]);
        },
        error:(err) => {
          console.log(err);
          this.isLoading = false;
          this.errmsg = err.error.message;
        }
      });
    }
  }
}
