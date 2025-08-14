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

  /** الحصول على جميع المنتجات */
  getallproducts():Observable<Products>
  {
     return this._Httpclient.get<Products>(`${Enviroment.baseUrl}/api/employee/products/`,{
      headers:this.userTokenHeader
    });
  }

  /** الحصول على منتج حسب الـ ID */
  getProductById(productId:string):Observable<any>
  {
     return this._Httpclient.get(`${Enviroment.baseUrl}/api/employee/products/${productId}`,{
      headers:this.userTokenHeader
    });
  }
      addNewProduct(data:any):Observable<any>
    {
       return this._Httpclient.post(`${Enviroment.baseUrl}/api/employee/products`, data, {
        headers:this.userTokenHeader
      });
    }
  /** تحديث منتج */
  updateProduct(productId:string, data:any):Observable<any> {
    return this._Httpclient.put(`${Enviroment.baseUrl}/api/employee/products/${productId}`, data, {
      headers: this.userTokenHeader
    });
  } 
  /** حذف منتج */
  deleteProduct(productId:string):Observable<any> {
    return this._Httpclient.delete(`${Enviroment.baseUrl}/api/employee/products/${productId}`, {
      headers: this.userTokenHeader
    });
  }
  
  addProductImage(productId: string, imageFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', imageFile);

    return this._Httpclient.post(`${Enviroment.baseUrl}/api/employee/products/${productId}/add-photos`, formData, {
      headers: this.userTokenHeader
    });
  }

  /** حذف صورة منتج */
  deleteProductImage(productId: string, imageId: string): Observable<any> {
    return this._Httpclient.delete(`${Enviroment.baseUrl}/api/employee/products/${productId}/remove-photo/`, {
      headers: this.userTokenHeader
    });
  }

  addMainImage(productId: string, imageFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', imageFile);

    return this._Httpclient.post(`${Enviroment.baseUrl}/api/employee/products/${productId}/main-photo`, formData, {
      headers: this.userTokenHeader
    });
  }


  getbarcodeProduct(productId: string): Observable<any> {
    return this._Httpclient.get(`${Enviroment.baseUrl}/api/employee/products/showBarcode/${productId}`, {
      headers: this.userTokenHeader
    });
  }
    getAllAttributesWithValues(): Observable<any> {
    return this._Httpclient.get(`${Enviroment.baseUrl}/api/employee/products/getAllAttributes`, {
      headers: this.userTokenHeader
    });
  }
}
