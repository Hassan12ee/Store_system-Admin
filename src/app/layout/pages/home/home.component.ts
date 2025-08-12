import { Product, Products } from './../../../shared/interfaces/product';
import { ProductService } from './../../../shared/services/product/product.service';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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

  constructor(private _ProductService:ProductService,private toastr:ToastrService, private _WishListService:WishListService ){}
  ngOnInit(): void {
    if( typeof localStorage!= 'undefined')
   localStorage.setItem('currentpage','/Home')
  
  this.getallproducts();

  }

  getallproducts()
  {
  this.isLoading=true;
    this._ProductService.getallproducts().subscribe({
      next : res =>{
        this.productlist = res.data.products;
        console.log(this.productlist)
        this.isLoading=false;
      },
      error : err =>{
        console.log(err);
        this.isLoading=false;
      }
    })

  }

}
