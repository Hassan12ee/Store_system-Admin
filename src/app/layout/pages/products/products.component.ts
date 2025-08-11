import { Component, OnInit } from '@angular/core';
import { Product, Products } from '../../../shared/interfaces/product';
import { ProductService } from '../../../shared/services/product/product.service';
import { FormsModule } from '@angular/forms';
import { SearchPipe } from "../../../shared/pipes/search.pipe";
import { WishListService } from '../../../shared/services/wishlist/wish-list.service';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, LowerCasePipe } from '@angular/common';
@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent  implements OnInit{
  isLoading:boolean=false;
  userWord:string='';
  productlist!:Product[];
  arr !:string[];
  constructor(private _ProductService:ProductService, private _WishListService:WishListService ,private toastr: ToastrService){}
  ngOnInit(): void {
    if( typeof localStorage!= 'undefined')
   localStorage.setItem('currentpage','/Products')
    this.getallproducts();

  }
  getallproducts()
  {
  this.isLoading=true;
    this._ProductService.getallproducts().subscribe({
      next : res =>{
        this.productlist = res.data.products;
        this.isLoading=false;
      },
      error : err =>{
        console.log(err);
        this.isLoading=false;
      }
    })

  }


}
