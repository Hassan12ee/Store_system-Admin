import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Enviroment } from '../../../base/Enviroment';
import { Observable } from 'rxjs';
import { Wishlist } from '../../interfaces/wishlist';

@Injectable({
  providedIn: 'root'
})
export class WishListService {
  userTokenHeader = {
    Authorization : localStorage.getItem("userToken") || '',
  }
  constructor(private _HttpClient:HttpClient) { }
  addProductToWishlist(productId:string):Observable<Wishlist>
  {
    return this._HttpClient.post<Wishlist>(`${Enviroment.baseUrl}/api/wishlist`, { product_id: productId },
      {
        headers: this.userTokenHeader
      }
    );
  }
  removeProductToWishlist(productId:string):Observable<Wishlist>
  {
    return this._HttpClient.delete<Wishlist>(`${Enviroment.baseUrl}/api/wishlist/${productId}`,
      {
        headers: this.userTokenHeader
      }
    );
  }
  GetLoggedUserWishlist():Observable<Wishlist>
  {
    return this._HttpClient.get<Wishlist>(`${Enviroment.baseUrl}/api/wishlist`,
      {
        headers: this.userTokenHeader
      }
    );
  }
}

