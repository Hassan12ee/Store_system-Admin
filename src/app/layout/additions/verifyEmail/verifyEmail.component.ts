import { Component, OnInit } from '@angular/core';
import { FlowbiteService } from '../../../shared/services/flowbite/flowbite.service';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators,} from "@angular/forms";
import { AuthService } from '../../../shared/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgetpassword',
  standalone: true,
  imports: [ReactiveFormsModule ],
  templateUrl: './verifyEmail.component.html',
  styleUrl: './verifyEmail.component.scss'
})
export class verifyEmailComponent implements OnInit {
  email!: string;
  constructor(private _AuthService:AuthService , private _Router:Router ,private _FlowbiteService:FlowbiteService){}
  ngOnInit(): void {
    this._FlowbiteService.loadFlowbite(flowbite => {
      // Your custom code here
      console.log('Flowbite loaded', flowbite);
    });
        if( typeof localStorage!= 'undefined')
    this.email = localStorage.getItem("email") || ''
  }
  isLoading:boolean = false;
  errmsg !:string;

  verifyEmailForm:FormGroup = new FormGroup({
    email : new FormControl(null,[Validators.required,Validators.email]),
      otp: new FormControl(null, [
    Validators.required,
    Validators.pattern(/^\d{6}$/)
  ])

  })
  verifyEmail:FormGroup = new FormGroup({
    email : new FormControl(null,[Validators.required,Validators.email]),})
  submitverifyEmail(){
    this.isLoading = true;
    if(this.verifyEmailForm.valid){
      //connect api
      this.email = this.verifyEmailForm.value.email;
      this._AuthService.verifyemailotp(this.verifyEmailForm.value).subscribe({
        next:(res)=>{
          this.isLoading = false;
          this._Router.navigate(["/Home"]);
        },
        error:(err) => {

          this.isLoading = false;
          this.errmsg = err.error.message;
        }
      });
    }
  }
   resendemailotp(){
    this.isLoading = true;
    this.verifyEmail.value.email = this.email;
    if(this.verifyEmail.invalid){
      //connect api

      this._AuthService.resendemailotp(this.verifyEmail.value).subscribe({
        next:(res)=>{
          this.isLoading = false;
          console.log("");
          this.errmsg = res.message;
        },
        error:(err) => {

          this.isLoading = false;
          this.errmsg = err.error.message;
        }
      });
    }else{
      this.errmsg = "err";
    }
  }


}
