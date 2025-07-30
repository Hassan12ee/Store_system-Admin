import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FlowbiteService } from '../../../shared/services/flowbite/flowbite.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators,} from "@angular/forms";

import { ForgetpasswordComponent } from '../forgetpassword/forgetpassword.component';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-reset-code',
  standalone: true,
  imports: [ForgetpasswordComponent ,ReactiveFormsModule],
  templateUrl: './reset-code.component.html',
  styleUrl: './reset-code.component.scss'
})
export class ResetCodeComponent implements OnInit {
  constructor(private _AuthService:AuthService , private _Router:Router ,private _FlowbiteService:FlowbiteService ) { }
   @Input() email!: any;
 id : string='';
  ngOnInit(): void {
    this._FlowbiteService.loadFlowbite(flowbite => {
      // Your custom code here
      console.log('Flowbite loaded', flowbite);
    });
     if( typeof localStorage!= 'undefined')
    this.id = localStorage.getItem("email") || ''
  }
 isLoading: any ;
 errmsg!:string ;
@Output() resetformflag =new EventEmitter<boolean>();
@Output() changepasswordformflag =new EventEmitter<boolean>();
verifyResetCodeForm: FormGroup = new FormGroup({
  email: new FormControl(null, ),
  otp: new FormControl(null, [
    Validators.required,
    Validators.pattern(/^\d{6}$/)
  ])
});


submitverifyResetCode(){
  this.verifyResetCodeForm.value.email = this.id;
  this.isLoading = true;
  if(this.verifyResetCodeForm.valid){
    //connect api
    this._AuthService.verifyResetCode(this.verifyResetCodeForm.value).subscribe({
      next:(res)=>{
        console.log(this.id,res);
        this.isLoading = false;
        this.resetformflag.emit(false);
        this.changepasswordformflag.emit(true);
      },
      error:(err) => {

        this.isLoading = false;
        this.errmsg = err.error.message;
      }
    });
  }
}

}
