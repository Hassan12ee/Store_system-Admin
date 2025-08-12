import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../../shared/services/order/order.service';
import { Router } from '@angular/router';
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


// Flex Layout (اختياري للـ responsive)
import { FlexLayoutModule } from '@angular/flex-layout';
@Component({
  selector: 'app-all-orders',
  standalone: true,
  imports: [    CommonModule,
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
    FlexLayoutModule],
  templateUrl: './all-orders.component.html',
  styleUrl: './all-orders.component.scss'
})
export class AllOrdersComponent implements OnInit {
    orders: any[] = [];
  currentPage = 1;
  perPage = 10;
  total = 0;
  lastPage = 1;
  
  filters = {
    governorate: '',
    city: '',
    status: '',
    order_id: '',
    customer_id: '',
    from: '',
    to: ''
  };

  loading = false;

  constructor(private orderService: OrderService, private router: Router ,private dialog: MatDialog) {}
  ngOnInit(): void {
    if( typeof localStorage!= 'undefined')
   localStorage.setItem('currentpage','/orders')
  this.getOrders();
  }
getOrders(page: number = 1) {
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

  this.orderService.getOrders(queryParams)
    .subscribe({
      next: (res) => {
        if (res.status) {
          this.orders = res.data;
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

openOrderDetails(order: any) {
  this.router.navigate(['/orders/edit', order.id]);
}


  resetFilters() {
    this.filters = {
      governorate: '',
      city: '',
      status: '',
      order_id: '',
      customer_id: '',
      from: '',
      to: ''
    };
    this.getOrders();
  }

    editOrder(orderId: number) {
    this.router.navigate(['/orders/edit', orderId]);
  }
  displayedColumns: string[] = [
  'id', 'order_id', 'status', 'order_date',
  'customer_name', 'address', 'total_items', 'created_at'
];

totalOrders = 0;

changePage(event: PageEvent) {
  this.currentPage = event.pageIndex + 1;
  this.getOrders();
}

}
