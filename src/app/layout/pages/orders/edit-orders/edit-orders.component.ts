import { OrderService } from './../../../../shared/services/order/order.service';
import { Order } from './../../../../shared/interfaces/order';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-edit-orders',
  standalone: true,
  imports: [],
  templateUrl: './edit-orders.component.html',
  styleUrl: './edit-orders.component.scss'
})
export class EditOrdersComponent {
id : string='';
  Order: any;
constructor(private _ActivatedRoute:ActivatedRoute ,private _OrderService:OrderService ) { }
ngOnInit(): void {           
    this._ActivatedRoute.params.subscribe({
      next: res => {
      this.id = res['ID'];
      }
    })
    if( typeof localStorage!= 'undefined')
      localStorage.setItem('currentpage',`/productdetails/${this.id}`)
    this.getOrderById();
  }
  getOrderById() {
  this._OrderService.getOrderById(this.id).subscribe({
    next: res => {
      this.Order = res;
      
    },
    error: err => {
      console.log(err);
    }
  });
  }
}
