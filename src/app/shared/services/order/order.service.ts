import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Enviroment } from '../../../base/Enviroment';
import { address } from '../../interfaces/data';
import { OrderRes } from '../../interfaces/order';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  userTokenHeader = {
    Authorization : localStorage.getItem("userToken") || '',
  }
  constructor(private _HttpClient:HttpClient) { }

  checkoutv(CartId:string,data:address):Observable<OrderRes>
  {
    return this._HttpClient.post<OrderRes>(`${Enviroment.baseUrl}/api/v1/orders/checkout-session/${CartId}?url=${Enviroment.baseUrlWeb}`,{
      shippingAddress: data
    },{
      headers:this.userTokenHeader
    });
  }
  checkoutc(CartId:string,data:address):Observable<OrderRes>
  {
    return this._HttpClient.post<OrderRes>(`${Enviroment.baseUrl}/api/v1/orders/${CartId}`,{
      shippingAddress: data
    },{
      headers:this.userTokenHeader
    });
  }
}
