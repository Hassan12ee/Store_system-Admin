import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Enviroment } from '../../../base/Enviroment';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  /** هيدر التوكن للمستخدم */
  userTokenHeader = {
    Authorization : localStorage.getItem("userToken") || '',
  }
  constructor(private _Httpclient:HttpClient) { }

    /** جلب كل ايصالات استلام المنتجات */
    getAllReceipts():Observable<any>
    {
       return this._Httpclient.get(`${Enviroment.baseUrl}/api/employee/warehouse/receipts`,{
        headers:this.userTokenHeader
      });
    }

    /** جلب ايصال استلام منتج معين */
    getReceipt(id:any):Observable<any>
    {
       return this._Httpclient.get(`${Enviroment.baseUrl}/api/employee/warehouse/receipts/${id}`,{
        headers:this.userTokenHeader
      });
    }

  /** جلب تاريخ استلام منتج معين */
    getProductReceiptsHistory(id:any):Observable<any>
    {
       return this._Httpclient.get(`${Enviroment.baseUrl}/api/employee/warehouse/receipts/getProductHistory/${id}`,{
        headers:this.userTokenHeader
      });
    }

    /** إضافة إيصال استلام منتج */
    addReceipts(data:any):Observable<any>
    {
       return this._Httpclient.post(`${Enviroment.baseUrl}/api/employee/warehouse/receipts`,data ,{
        headers:this.userTokenHeader
      });
    }

    /** إضافة منتج تالف */
    addDamagedProduct():Observable<any>
    {
       return this._Httpclient.get(`${Enviroment.baseUrl}/api/employee/warehouse/damagedProducts`,{
        headers:this.userTokenHeader
      });
    }

    /** جلب كل المنتجات التالفة */
    getAllDamagedProducts():Observable<any>
    {
       return this._Httpclient.get(`${Enviroment.baseUrl}/api/employee/warehouse/receipts`,{
        headers:this.userTokenHeader
      });
    }

}
