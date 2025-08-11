import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../../../shared/services/product/product.service';
import { OrderService } from '../../../../shared/services/order/order.service';
import { Product } from '../../../../shared/interfaces/product';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { OrderSuccessDialogComponent } from './order-success-dialog.component';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-new-order',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    FormsModule,
    OrderSuccessDialogComponent],
  templateUrl: './new-order.component.html',
  styleUrl: './new-order.component.scss'
})
export class NewOrderComponent {
    Math = Math; // ⬅️ أضف هذا السطر هنا

  fb = inject(FormBuilder);
  http = inject(HttpClient);

  form: FormGroup;
  products: any[] = [];
  loading = false;
  message = '';
  totalPrice = 0;
  userExists: boolean | null = null;
checkingPhone = false;
userConfirmed = false;
userAddresses: any[] = [];
selectedAddressId: number = 0; // اجعلها number وليس null
userId: number | null = null; // أضف هذا المتغير في الكلاس

  constructor(
    private _ProductService: ProductService,
    private _OrderService: OrderService,
    private dialog: MatDialog // أضف هذا
  ) {
                if( typeof localStorage!= 'undefined')
   localStorage.setItem('currentpage','/orders/new')
    this.form = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      phone: ['', Validators.required],
      governorate: ['', Validators.required],
      city: ['', Validators.required],
      street: ['', Validators.required],
      comments: [''],
      order_items: this.fb.array([this.createItem()])
    });

    this.loadProducts();
    this.form.valueChanges.subscribe(() => this.calculateTotal());

    // اربط كل عنصر order_item بتغيير السعر عند تغيير المنتج
    this.orderItems.controls.forEach((item, i) => this.setupProductPriceListener(item as FormGroup, i));
  }

  createItem(): FormGroup {
    return this.fb.group({
      product_id: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]],
    });
  }

  get orderItems(): FormArray {
    return this.form.get('order_items') as FormArray;
  }

  addItem() {
    const item = this.createItem();
    this.orderItems.push(item);
    this.setupProductPriceListener(item, this.orderItems.length - 1);
  }

  setupProductPriceListener(item: FormGroup, index: number) {
    item.get('product_id')?.valueChanges.subscribe(productId => {
      const product = this.getProduct(productId);
      if (product) {
        item.get('price')?.setValue(product.price, { emitEvent: false });
      } else {
        item.get('price')?.setValue(0, { emitEvent: false });
      }
      this.calculateTotal();
    });
  }

  removeItem(index: number) {
    this.orderItems.removeAt(index);
  }

      loadProducts(): void 
  {
  
    this._ProductService.getallproducts().subscribe({
      next : res =>{
        this.products = res.data.products;
        // حدث الأسعار للمنتجات المختارة
        this.orderItems.controls.forEach(item => {
          const productId = (item as FormGroup).get('product_id')?.value;
          const product = this.getProduct(productId);
          if (product) {
            (item as FormGroup).get('price')?.setValue(product.price, { emitEvent: false });
          }
        });
      },
      error : err =>{
        console.log(err);
        
      }
    })

  }


  calculateTotal() {
    this.totalPrice = this.orderItems.controls.reduce((sum, item) => {
      const quantity = item.get('quantity')?.value || 0;
      const price = item.get('price')?.value || 0;
      return sum + quantity * price;
    }, 0);
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.message = 'Please fill all required fields';
      return;
    }

    this.loading = true;
    let request$;
    if (this.userExists === true) {
      // استخدم ميثود existing-user-order
      request$ = this._OrderService.orderExistingUser(this.form.value);
    } else {
      // استخدم ميثود guest-order
      request$ = this._OrderService.orderfg(this.form.value);
    }

    request$.subscribe({
      next: (res) => {
        this.message = 'Order submitted successfully';
        this.form.reset();
        this.orderItems.clear();
        this.addItem();

        // فتح المودال مع البيانات
        if (res?.data) {
          this.dialog.open(OrderSuccessDialogComponent, {
            data: res.data,
            disableClose: true // يمنع الإغلاق إلا بزر Close
          });
        }
      },
      error: (err) => {
        this.message = 'Error submitting order';
        console.error(err);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  getProduct(productId: number) {
    return this.products.find(p => p.id == productId);
  }

  isProductSelected(productId: number, currentIndex: number): boolean {
    // تحقق إذا كان المنتج مختار في أي عنصر آخر غير الحالي
    return this.orderItems.controls.some((item, idx) =>
      idx !== currentIndex && item.get('product_id')?.value == productId
    );
  }

  checkPhoneNumber() {
    const phone = this.form.get('phone')?.value;
    if (!phone) return;
    this.checkingPhone = true;
    this._OrderService.checkPhone(phone).subscribe({
      next: res => {
        this.userExists = res.user_exists;
        this.userId = res.user_id; // احفظ الـ id هنا
        this.checkingPhone = false;
      },
      error: () => {
        this.userExists = null;
        this.userId = null;
        this.checkingPhone = false;
      }
    });
  }

  confirmUser() {
    this.userConfirmed = true;
    // استخدم userId مباشرة بدون طلب جديد
    if (this.userId) {
      this.getUserAddresses(this.userId);
    }
  }

  getUserAddresses(userId: number) {
    this._OrderService.getUserAddresses(userId).subscribe({
      next: res => {
        if (res.status && res.data && res.data.length) {
          this.userAddresses = res.data;
          console.log('User Addresses:', this.userAddresses[0].id);
          // اجعل أول عنوان هو الافتراضي فقط إذا لم يكن هناك اختيار سابق
          if (!this.selectedAddressId || !this.userAddresses.some(addr => addr.id === this.selectedAddressId)) {
            this.selectedAddressId = this.userAddresses[0].id;
          }
        } else {
          this.userAddresses = [];
          this.selectedAddressId = 0; // لعرض فورم إضافة عنوان جديد إذا لم يوجد عناوين
        }
      }
    });
  }

  onAddressChange(event: any) {
    this.selectedAddressId = event.value;
  }
}


