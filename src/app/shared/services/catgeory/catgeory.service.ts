import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Enviroment } from '../../../base/Enviroment';
import { Observable } from 'rxjs';
import { CategoryRes } from '../../interfaces/category';

@Injectable({
  providedIn: 'root'
})
export class CatgeoryService {

  constructor(private _HttpClient:HttpClient) { }
  getAllCategories():Observable<CategoryRes>
  {
    return this._HttpClient.get<CategoryRes>(`${Enviroment.baseUrl}/api/v1/categories`);
  }
}
