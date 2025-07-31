import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, SelectControlValueAccessor, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FlowbiteService } from '../../../shared/services/flowbite/flowbite.service';
import { OrderService } from '../../../shared/services/order/order.service';

@Component({
  selector: 'app-shipping-address',
  standalone: true,
  imports: [ReactiveFormsModule , RouterLink],
  templateUrl: './shipping-address.component.html',
  styleUrl: './shipping-address.component.scss'
})
export class ShippingAddressComponent implements OnInit {
  errmsg!: string;
  constructor(private _OrderService:OrderService , private _Router:Router ,private _FlowbiteService:FlowbiteService ,private  _ActivatedRoute:ActivatedRoute){}
  ngOnInit(): void {

    this._FlowbiteService.loadFlowbite(flowbite => {
      // Your custom code here

    });
  }
  isLoading: boolean = false;
  ShippingAddressForm:FormGroup = new FormGroup({
    governorate : new FormControl(null,Validators.required),
    comments : new FormControl(null,[Validators.required]),
    city : new FormControl(null,Validators.required,),
    street: new FormControl(null,Validators.required)
  })
  submitShippingAddress(){
    this.isLoading = true;

    if(this.ShippingAddressForm.value.pay == 'sp'){
    if(this.ShippingAddressForm.valid){
      //connect api
      this._ActivatedRoute.paramMap.subscribe({next: params => {

        this._OrderService.checkoutv(params.get("id")!,this.ShippingAddressForm.value).subscribe({
          next:(res)=>{
            this.isLoading = false;
            window.open(res.session.url, '_self')
          },
          error:(err) => {

            this.isLoading = false;
            this.errmsg = err.error.message;
          }
        });
      }})

    }
  }
  else if(this.ShippingAddressForm.value.pay == 'cp'){
    if(this.ShippingAddressForm.valid){
      //connect api
      this._ActivatedRoute.paramMap.subscribe({next: params => {

        // this._OrderService.checkoutc(params.get("id")!,this.ShippingAddressForm.value).subscribe({
        //   next:(res)=>{
        //     this.isLoading = false;
        //     this._Router.navigate(["/allorders"]);
        //   },
        //   error:(err) => {

        //     this.isLoading = false;
        //     this.errmsg = err.error.message;
        //   }
        // });
      }})

    }
  }
  else{
    this.errmsg='choese a way of pay'
  }
  }

}
