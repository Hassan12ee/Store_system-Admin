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

  /** إنشاء طلب جديد للزوار */
  orderfg(data:any):Observable<any> {
    return this._HttpClient.post<any>(`${Enviroment.baseUrl}/api/employee/orders/guest-order`,data,{
      headers:this.userTokenHeader
    });
  }

  /** التحقق من رقم الهاتف */
  checkPhone(phone: string) {
    return this._HttpClient.post<any>(`${Enviroment.baseUrl}/api/employee/orders/check-phone`, { phone }, {
      headers: this.userTokenHeader
    });
  }

  /** إنشاء طلب جديد للمستخدمين المسجلين */
  orderExistingUser(data: any): Observable<any> {
    return this._HttpClient.post<any>(`${Enviroment.baseUrl}/api/employee/orders/existing-user-order`, data, {
      headers: this.userTokenHeader
    });
  }

  /** الحصول على الطلبات */
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

  /** الحصول على عناوين المستخدم */
  getUserAddresses(userId: number) {
    return this._HttpClient.get<any>(`${Enviroment.baseUrl}/api/employee/orders/users/${userId}/addresses`, {
      headers: this.userTokenHeader
    });
  }

  /** إضافة عنوان جديد للمستخدم */
  addAddress(userId: number, addressData: any) {
    return this._HttpClient.post<any>(`${Enviroment.baseUrl}/api/employee/orders/users/${userId}/addresses`, addressData, {
      headers: this.userTokenHeader
    });
  }

  /** تحديث الطلب */
  updateOrder(orderId: any, updatedData: any): Observable<any> {
    return this._HttpClient.put(`${Enviroment.baseUrl}/api/employee/orders/${orderId}/update`, updatedData, { headers: this.userTokenHeader });
  }

  /** تحديث حالة الطلب */
  updatestatus(orderId: number, updatedData: any): Observable<any> {
    return this._HttpClient.put(`${Enviroment.baseUrl}/api/employee/orders/${orderId}/status`, updatedData, { headers: this.userTokenHeader });
  }

  /** تحديث عنوان المستخدم */
  updateaddress(UserId: number, updatedData: any): Observable<any> {
    return this._HttpClient.put(`${Enviroment.baseUrl}/api/employee/orders/${UserId}/address`, updatedData, { headers: this.userTokenHeader });
  }

  /** الحصول على طلب بواسطة ID */
  getOrderById(id: string): Observable<any> {
    return this._HttpClient.get(`${Enviroment.baseUrl}/api/employee/orders/${id}`, { headers: this.userTokenHeader });
  }
  
}
