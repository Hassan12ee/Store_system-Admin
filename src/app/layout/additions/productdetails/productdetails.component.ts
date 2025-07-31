
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../shared/services/product/product.service';
import { ActivatedRoute } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { Product } from '../../../shared/interfaces/product';


@Component({
  selector: 'app-productdetails',
  standalone: true,
  imports: [],
  templateUrl: './productdetails.component.html',
  styleUrl: './productdetails.component.scss'
})
export class ProductdetailsComponent implements OnInit{
constructor(private _ProductService:ProductService ,private _ActivatedRoute:ActivatedRoute ,private toastr: ToastrService) {

 }
 id : string='';
  ngOnInit(): void {
    this._ActivatedRoute.params.subscribe({
      next: res => {
      this.id = res['ID'];
      }
    })
    if( typeof localStorage!= 'undefined')
      localStorage.setItem('currentpage',`/productdetails/${this.id}`)
    this.getProductById()
  }
  product!: Product;

  getProductById()
  {
    let id :string='';
    this._ActivatedRoute.params.subscribe({
      next :p =>{
        id = p ['id'];
      }
    })
    this._ProductService.getProductById(this.id).subscribe({
      next : res =>{
       this.product = res ;
        console.log()

      },
      error : err =>{
        console.log(err);

      }
    })

  }

}
