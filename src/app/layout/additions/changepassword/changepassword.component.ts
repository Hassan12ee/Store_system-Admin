import { code } from './../../../shared/interfaces/data';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ForgetpasswordComponent } from '../forgetpassword/forgetpassword.component';
import { FlowbiteService } from '../../../shared/services/flowbite/flowbite.service';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-changepassword',
  standalone: true,
  imports: [ForgetpasswordComponent ,ReactiveFormsModule],
  templateUrl: './changepassword.component.html',
  styleUrl: './changepassword.component.scss'
})
export class ChangepasswordComponent implements OnInit{
constructor(private _FlowbiteService:FlowbiteService ,private _AuthService:AuthService , private _Router:Router) { }
  ngOnInit(): void {
    this._FlowbiteService.loadFlowbite(flowbite => {
      // Your custom code here
      console.log('Flowbite loaded', flowbite);

    });

  }
   isLoading: boolean=false ;
  errmsg!: string;
  @Input() email!: any;

  changepasswordform:FormGroup = new FormGroup({

    email : new FormControl(this.email),
    new_password : new FormControl(null, [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)]),
    new_password_confirmation : new FormControl(null,Validators.required,),

  })
  checkRepasswordMatch(g:AbstractControl) {
    if( g.get('new_password')?.value === g.get("new_password_confirmation")?.value)
      {
        return null;
      }
      else{
        g.get('rePassword')?.setErrors({mismatch:true})
        return {mismatch:true};
      }
  }

  submitchangepasswordform(){
    this.isLoading = true;
    console.log(this.changepasswordform.value)
    this.changepasswordform.value.email=this.email;
    if(this.changepasswordform.valid){
      //connect api
      this._AuthService.resetPassword(this.changepasswordform.value).subscribe({
        next:(res)=>{
          this.isLoading = false;
          this._Router.navigate(["/login"]);
        },
        error:(err) => {

          this.isLoading = false;
          this.errmsg = err.error.message;
        }
      });
    }
  }
}
