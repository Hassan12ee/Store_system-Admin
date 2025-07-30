import { Component, OnInit } from '@angular/core';
import { Product, Products } from '../../../shared/interfaces/product';
import { ProductService } from '../../../shared/services/product/product.service';
import { FormsModule } from '@angular/forms';
import { SearchPipe } from "../../../shared/pipes/search.pipe";
import { WishListService } from '../../../shared/services/wishlist/wish-list.service';
import { CartService } from '../../../shared/services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, LowerCasePipe } from '@angular/common';
@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ FormsModule, SearchPipe ,CurrencyPipe,LowerCasePipe, RouterLink],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent  implements OnInit{
  isLoading:boolean=false;
  userWord:string='';
  productlist!:Product[];
  arr !:string[];
  constructor(private _ProductService:ProductService,private _CartService:CartService, private _WishListService:WishListService ,private toastr: ToastrService){}
  ngOnInit(): void {
    if( typeof localStorage!= 'undefined')
   localStorage.setItem('currentpage','/Products')
    this.getallproducts();
  this.GetLoggedUserWishlist();
  }
  getallproducts()
  {
  this.isLoading=true;
    this._ProductService.getallproducts().subscribe({
      next : res =>{
        this.productlist = res.products;
        console.log(this.productlist)
        this.isLoading=false;
      },
      error : err =>{
        console.log(err);
        this.isLoading=false;
      }
    })

  }
  addProductToCart(preoductId:string)
{
  this._CartService.addProductToCart(preoductId).subscribe({
    next: res =>{
      console.log(res);
      this.toastr.success(res.message ,'',{
        progressBar: true,
      });
    },
    error: err =>{}
  })
}
GetLoggedUserWishlist(){
  this._WishListService.GetLoggedUserWishlist().subscribe({
    next :res =>{
       let arr:string[] =[];
       arr.pop();
      for(let item of res.products){
        console.log(item.product_id);
        arr.push(item.product_id);
      }
      this.arr = arr;
      },
      error:err =>{
        console.log(err)
      }


  })
}
addProductToWishlist(preoductId:string)
{
  this._WishListService.addProductToWishlist(preoductId).subscribe({
    next: res =>{
      this.GetLoggedUserWishlist();
      console.log(res);
      this.toastr.success(res.message ,'',{
        progressBar: true,
      });
    },
    error: err =>{}
  })
}
removeProductToWishlist(preoductId:string)
{
  this._WishListService.removeProductToWishlist(preoductId).subscribe({
    next: res =>{
      this.GetLoggedUserWishlist();
      console.log(res);
      this.toastr.success(res.message ,'',{
        progressBar: true,
      });
    },
    error: err =>{}
  })
}


}
