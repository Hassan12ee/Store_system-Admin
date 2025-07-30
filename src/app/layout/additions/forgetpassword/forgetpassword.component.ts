import { Component, OnInit } from '@angular/core';
import { FlowbiteService } from '../../../shared/services/flowbite/flowbite.service';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators,} from "@angular/forms";
import { AuthService } from '../../../shared/services/auth/auth.service';
import { Router } from '@angular/router';
import { ResetCodeComponent } from '../reset-code/reset-code.component';
import { ChangepasswordComponent } from '../changepassword/changepassword.component';
@Component({
  selector: 'app-forgetpassword',
  standalone: true,
  imports: [ReactiveFormsModule ,ResetCodeComponent , ChangepasswordComponent],
  templateUrl: './forgetpassword.component.html',
  styleUrl: './forgetpassword.component.scss'
})
export class ForgetpasswordComponent implements OnInit {
  email!: string;
  emailformflag:boolean=true;
  resetformflag:boolean=false;
  changepasswordformflag:boolean=false;

  constructor(private _AuthService:AuthService , private _Router:Router ,private _FlowbiteService:FlowbiteService){}
  ngOnInit(): void {
    this._FlowbiteService.loadFlowbite(flowbite => {
      // Your custom code here
      console.log('Flowbite loaded', flowbite);
    });
  }
  isLoading:boolean = false;
  errmsg !:string;

  forgetpasswordForm:FormGroup = new FormGroup({
    email : new FormControl(null,[Validators.required,Validators.email]),

  })
  res(x:boolean)
  {
    this.changepasswordformflag = x;
  }
  resv(x:boolean)
  {
    this.resetformflag = x;
  }
  submitforgetpassword(){
    this.isLoading = true;
    if(this.forgetpasswordForm.valid){
      //connect api
      this.email = this.forgetpasswordForm.value.email;
      this._AuthService.Forgetpassword(this.forgetpasswordForm.value).subscribe({
        next:(res)=>{
          this.isLoading = false;
          localStorage.setItem("email",this.forgetpasswordForm.value.email);
          this.emailformflag=false;
          this.resetformflag=true;
        },
        error:(err) => {

          this.isLoading = false;
          this.errmsg = err.error.message;
        }
      });
    }
  }


}
