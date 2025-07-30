import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { brands, Brandsres } from '../../interfaces/brands';
import { Enviroment } from '../../../base/Enviroment';

@Injectable({
  providedIn: 'root'
})
export class BrandsService {

  constructor(private _HttpClient:HttpClient) { }
  getAllBrands():Observable<Brandsres>
  {
    return this._HttpClient.get<Brandsres>(`${Enviroment.baseUrl}/api/v1/brands`);
  }
}
