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
  orderfg(data:any):Observable<any>
  {
    return this._HttpClient.post<any>(`${Enviroment.baseUrl}/api/employee/orders/guest-order`,data,{
      headers:this.userTokenHeader
    });
  }
  checkPhone(phone: string) {
    return this._HttpClient.post<any>(`${Enviroment.baseUrl}/api/employee/orders/check-phone`, { phone }, {
      headers: this.userTokenHeader
    });
  }
  orderExistingUser(data: any): Observable<any> {
    return this._HttpClient.post<any>(`${Enviroment.baseUrl}/api/employee/orders/existing-user-order`, data, {
      headers: this.userTokenHeader
    });
  }
  getUserAddresses(userId: number) {
    return this._HttpClient.get<any>(`${Enviroment.baseUrl}/api/employee/users/${userId}/addresses`, {
      headers: this.userTokenHeader
    });
  }
}
