import { Product, Products } from './../../interfaces/product';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Enviroment } from '../../../base/Enviroment';


@Injectable({
  providedIn: 'root'
})
export class ProductService {
    userTokenHeader = {
    Authorization : localStorage.getItem("userToken") || '',
  }

  constructor(private _Httpclient:HttpClient) { }
  getallproducts():Observable<Products>
  {
     return this._Httpclient.get<Products>(`${Enviroment.baseUrl}/api/employee/products/`,{
      headers:this.userTokenHeader
    });
  }
  getProductById(productId:string):Observable<any>
  {
     return this._Httpclient.get(`${Enviroment.baseUrl}/api/employee/products/${productId}`,{
      headers:this.userTokenHeader
    });
  }

}
