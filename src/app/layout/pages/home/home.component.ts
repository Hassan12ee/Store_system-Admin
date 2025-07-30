import { Product, Products } from './../../../shared/interfaces/product';
import { ProductService } from './../../../shared/services/product/product.service';
import { Component, OnInit } from '@angular/core';
import { CategorsliderComponent } from '../../additions/categorslider/categorslider.component';

import { RouterLink } from '@angular/router';
import { CurrencyPipe, LowerCasePipe, UpperCasePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { SearchPipe } from "../../../shared/pipes/search.pipe";
import { CartService } from '../../../shared/services/cart/cart.service';
import { FormsModule } from '@angular/forms';
import { WishListService } from '../../../shared/services/wishlist/wish-list.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  isLoading:boolean=false;
  productlist!:Product[];
  arr !:string[];
  userWord:string='';

  constructor(private _ProductService:ProductService,private _CartSrevice:CartService,private toastr:ToastrService, private _WishListService:WishListService ){}
  ngOnInit(): void {
    if( typeof localStorage!= 'undefined')
   localStorage.setItem('currentpage','/Home')

  this.getallproducts();
  this.GetLoggedUserWishlist()
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
  addProductToCart(ProductId:string)
  {
this._CartSrevice.addProductToCart(ProductId).subscribe({
  next:res=>{
    console.log(res);
      this.toastr.success(res.message ,'',{
        progressBar: true,

      });
    }
})
  }

  GetLoggedUserWishlist(){
    this._WishListService.GetLoggedUserWishlist().subscribe({
      next :res =>{
         let arr:string[] =[];
         arr.pop();
        for(let item of res.products){

           arr.push(item.product_id);
        }
        this.arr = arr;
        console.log(this.arr)
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
        console.log(res);
        this.GetLoggedUserWishlist()
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
        console.log(res);
        this.GetLoggedUserWishlist()
        this.toastr.success(res.message ,'',{
          progressBar: true,
        });
      },
      error: err =>{}
    })
  }

}
