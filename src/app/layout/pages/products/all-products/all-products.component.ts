import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-all-products',
  standalone: true,
  imports: [],
  templateUrl: './all-products.component.html',
  styleUrl: './all-products.component.scss'
})
export class AllProductsComponent implements OnInit {
  ngOnInit(): void {
    if( typeof localStorage!= 'undefined')
   localStorage.setItem('currentpage','/products')
  }
}
