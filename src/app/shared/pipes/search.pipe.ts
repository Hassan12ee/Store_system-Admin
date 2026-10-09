import { Product } from './../interfaces/product';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
  standalone: true
})
export class SearchPipe implements PipeTransform {

  transform(productList:Product[], userWord:string): Product[] {
    return productList.filter( (item) => item.name_Ar.toLowerCase().includes(userWord.toLowerCase()) ) ;
  }

}
