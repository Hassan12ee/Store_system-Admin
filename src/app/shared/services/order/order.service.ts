import { HttpClient, HttpParams } from '@angular/common/http';
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
    getOrders(params?: any): Observable<any> {
          let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }

    return this._HttpClient.get(`${Enviroment.baseUrl}/api/employee/orders`, { 
      params: httpParams,
      headers: this.userTokenHeader
    });
  }
  getUserAddresses(userId: number) {
    return this._HttpClient.get<any>(`${Enviroment.baseUrl}/api/employee/orders/users/${userId}/addresses`, {
      headers: this.userTokenHeader
    });
  }
  addAddress(userId: number, addressData: any) {
    return this._HttpClient.post<any>(`${Enviroment.baseUrl}/api/employee/orders/users/${userId}/addresses`, addressData, {
      headers: this.userTokenHeader
    });
  }
    updateOrder(orderId: number, updatedData: any): Observable<any> {
    return this._HttpClient.put(`${Enviroment.baseUrl}/api/employee/orders/${orderId}`, updatedData, { headers: this.userTokenHeader });
  }
  getOrderById(id: string): Observable<any> {
    return this._HttpClient.get(`${Enviroment.baseUrl}/api/employee/orders/${id}`, { headers: this.userTokenHeader });
  }
}
