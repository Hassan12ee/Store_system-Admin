import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Router, RouterModule } from '@angular/router';
// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ProductService } from '../../../../shared/services/product/product.service';
@Component({
  selector: 'app-all-products',
  standalone: true,
  imports: [
        RouterModule,
        CommonModule,
        FormsModule,
        // Angular Material
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatTableModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatIconModule,
        MatSelectModule,
        // Flex Layout
        FlexLayoutModule
  ],
  templateUrl: './all-products.component.html',
  styleUrl: './all-products.component.scss'
})
export class AllProductsComponent implements OnInit {
    Products: any[] = [];
    currentPage = 1;
    perPage = 10;
    total = 0;
    lastPage = 1;
    filters = {
      search: '',
      category: '',
      brand: '',
    };
  
    loading = false;
  
    constructor(private _ProductService: ProductService, private router: Router ,private dialog: MatDialog) {}
  ngOnInit(): void {
    if( typeof localStorage!= 'undefined')
   localStorage.setItem('currentpage','/products')
    this.getProducts();

  }
  getProducts(page: number = 1) {
    this.loading = true;
  
    let queryParams: any = {
      per_page: this.perPage,
      page
    };
  
    Object.keys(this.filters).forEach(key => {
      const value = (this.filters as any)[key];
      if (value) {
        queryParams[key] = value;
      }
    });
  
    this._ProductService.getallproductsv(queryParams)
      .subscribe({
        next: (res) => {
          if (res.status) {
            console.log(res.data.products);
            this.Products = res.data.products;
            this.currentPage = res.current_page;
            this.perPage = res.per_page;
            this.total = res.total;
            this.lastPage = res.last_page;
          }
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }
  
  
  resetFilters() {
    this.filters = {
      search: '',
      category: '',
      brand: '',
    };
    this.currentPage = 1;
    this.getProducts();
  }
  
    
displayedColumns: string[] = [
  'product_id',
  'name_Ar',
  'main_photo',
  'brand',
  'category',
  'created_at',
  'updated_at'
];


  
  changePage(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.perPage = event.pageSize; // تحديث حجم الصفحة
    this.getProducts(this.currentPage);
  }

  

  
}
