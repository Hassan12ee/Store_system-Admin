import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OrderService } from './../../../../shared/services/order/order.service';
import { ProductService } from './../../../../shared/services/product/product.service';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
@Component({
  selector: 'app-edit-products',
  standalone: true,
  imports: [

    CarouselModule,
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
   MatTooltipModule,
    MatRadioModule
  ],
  templateUrl: './edit-products.component.html',
  styleUrl: './edit-products.component.scss'
})
export class EditProductsComponent {
   customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: true
  }
  Math = Math;
  id: string = '';
  product: any[] = [];
  userAddresses: any[] = [];
  Cities: any[] = [];
  Governorates: any[] = [];
  selectedAddressId: number = 0;
  userId: number | null = null;
  totalPrice: number = 0;
  message = '';
  loading = false;

  fb = inject(FormBuilder);
  http = inject(HttpClient);

  form: FormGroup = this.fb.group({


  });

  constructor(
    private route: ActivatedRoute,
    private _ProductService: ProductService
  ) {}

  ngOnInit(): void {
  
      this.route.params.subscribe(params => {
        this.id = params['ID'];
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('currentpage', `/products/edit/${this.id}`);
        }
        this.getProductsById();
      });


  }


  getProductsById():  Promise<void> {
    return new Promise((resolve, reject) => {
    this.loading = true;
    this._ProductService.getProductById(this.id).subscribe({
      next: res => {
        this.product = res.data.product;
         console.log(this.product);
        if (res.data.customer?.id) {
          this.userId = res.data.customer.id;
        }
        // this.fillFormWithData(res.data);
        this.loading = false;
        resolve();
      },
      error: err => {
        console.error(err);
        this.loading = false;
        reject(err);
      }
    });
  })
  }

  // fillFormWithData(order: any): void {
  //     this.form.patchValue({
  //       status: order.status || '',
  //       first_name: order.customer.FristName || '',
  //       last_name: order.customer.LastName || '',
  //       email: order.customer.email || '',
  //       phone: order.customer.Phone || ''
  //     });

  //   // مسح العناصر القديمة
  //   this.orderItems.clear();

  //   order.items.forEach((item: any) => {
  //     const group = this.fb.group({
  //       id: [item.id],
  //       product_id: [item.product_variants_id, Validators.required],
  //       quantity: [item.quantity, [Validators.required, Validators.min(1)]],
  //       price: [item.price],
  //     });

  //     this.setupProductPriceListener(group);
  //     this.orderItems.push(group);
  //   });

  //   // تحديث userAddresses و selectedAddressId
  //   if (order.address) {
  //     this.userAddresses = [order.address];
  //     this.selectedAddressId = order.address.id;
  //   }

  //   // تحديث الأسعار بعد تحميل المنتجات
  //   this.orderItems.controls.forEach(item => {
  //     const productId = item.get('product_id')?.value;
  //     const product = this.getProduct(productId);
  //     if (product) item.get('price')?.setValue(product.price, { emitEvent: false });
  //   });

  //   this.calculateTotal();
  // }














  submit(): void {
    if (this.form.invalid) {
      this.message = 'يرجى ملء جميع الحقول المطلوبة';
      return;
    }
    this.loading = true;

    const customerData = {
      id: this.userId,
      FristName: this.form.get('first_name')?.value || '',
      LastName: this.form.get('last_name')?.value || '',
      email: this.form.get('email')?.value || '',
      Phone: this.form.get('phone')?.value || ''
    };



  

    this._ProductService.updateProduct(this.id, 1).subscribe({
      next: res => {
        this.loading = false;
        
          this.message = 'تم تحديث الطلب بنجاح';
          this.getProductsById();
       
      },
      error: err => {
        console.error(err);
        this.loading = false;
        this.message = 'خطأ أثناء تحديث الطلب';
      }
    });
  }



}
