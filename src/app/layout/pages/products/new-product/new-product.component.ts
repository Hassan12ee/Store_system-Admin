import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-product',
  standalone: true,
  imports: [],
  templateUrl: './new-product.component.html',
  styleUrl: './new-product.component.scss'
})
export class NewProductComponent implements OnInit{
  ngOnInit(): void {
    if( typeof localStorage!= 'undefined')
   localStorage.setItem('currentpage','/products/new')
  }
}
