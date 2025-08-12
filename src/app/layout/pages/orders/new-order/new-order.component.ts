import { address } from './../../../../shared/interfaces/data';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../../../shared/services/product/product.service';
import { OrderService } from '../../../../shared/services/order/order.service';
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
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    FormsModule,
    OrderSuccessDialogComponent
  ],
  templateUrl: './new-order.component.html',
  styleUrl: './new-order.component.scss'
})
export class NewOrderComponent {
  Math = Math;

  fb = inject(FormBuilder);
  http = inject(HttpClient);

  form: FormGroup;
  formex!: FormGroup;
  products: any[] = [];
  loading = false;
  message = '';
  totalPrice = 0;
  userExists: boolean | null = null;
  checkingPhone = false;
  userConfirmed = false;
  userAddresses: any[] = [];
  selectedAddressId: number = 0;
  userId: number | null = null;

  constructor(
    private _ProductService: ProductService,
    private _OrderService: OrderService,
    private dialog: MatDialog
  ) {
    if (typeof localStorage != 'undefined')
      localStorage.setItem('currentpage', '/orders/new');

    this.form = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      phone: ['', Validators.required],
      address_id: [''],
      governorate: [''],
      city: ['' ],
      street: [''],
      comments: [''],
      order_items: this.fb.array([this.createItem()])
    });

    this.loadProducts();
    this.form.valueChanges.subscribe(() => this.calculateTotal());

    this.orderItems.controls.forEach((item, i) =>
      this.setupProductPriceListener(item as FormGroup, i)
    );
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

  loadProducts(): void {
    this._ProductService.getallproducts().subscribe({
      next: res => {
        this.products = res.data.products;
        this.orderItems.controls.forEach(item => {
          const productId = (item as FormGroup).get('product_id')?.value;
          const product = this.getProduct(productId);
          if (product) {
            (item as FormGroup).get('price')?.setValue(product.price, { emitEvent: false });
          }
        });
      },
      error: err => {
        console.log(err);
      }
    });
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

    const sendOrder = () => {
      const payload = {
        ...this.form.value,
        address_id: this.selectedAddressId !== 0 ? this.selectedAddressId : null
      };

      let request$;
      if (this.userExists === true) {
        request$ = this._OrderService.orderExistingUser(payload);
      } else {
        request$ = this._OrderService.orderfg(payload);
      }

      request$.subscribe({
        next: (res) => {
          this.message = 'Order submitted successfully';


          if (res?.data) {
            this.dialog.open(OrderSuccessDialogComponent, {
              data: res.data,
              disableClose: true
            }
          
            ).afterClosed().subscribe(() => {
                        this.form.reset();
          this.orderItems.clear();
          this.addItem();
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
    };
      sendOrder();
    
  }
addNewAddressForUser() {
  if (!this.userId) {
    this.message = 'لا يوجد مستخدم محدد';
    return;
  }

  const addressData = {
    governorate: this.form.get('governorate')?.value,
    city: this.form.get('city')?.value,
    street: this.form.get('street')?.value,
    comments: this.form.get('comments')?.value
  };

  this._OrderService.addAddress(this.userId, addressData).subscribe({
    next: (res) => {
      if (res?.data?.id) {
        this.message = 'تمت إضافة العنوان بنجاح';
              if(this.userId !== null )
        this.getUserAddresses(this.userId); // تحديث القائمة
        this.selectedAddressId = res.data.id; // تحديد العنوان الجديد
      }
    },
    error: (err) => {
      console.error(err);
      this.message = 'خطأ أثناء إضافة العنوان';
    }
  });
}
  getProduct(productId: number) {
    return this.products.find(p => p.id == productId);
  }

  isProductSelected(productId: number, currentIndex: number): boolean {
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
        this.userId = res.user_id;
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
    if (this.userId) {
      this.getUserAddresses(this.userId);
    }
  }

  getUserAddresses(userId: number) {
    this._OrderService.getUserAddresses(userId).subscribe({
      next: res => {
        if (res.status && res.data && res.data.length) {
          this.userAddresses = res.data;
          if (!this.selectedAddressId || !this.userAddresses.some(addr => addr.id === this.selectedAddressId)) {
            this.selectedAddressId = this.userAddresses[0].id;
          }
        } else {
          this.userAddresses = [];
          this.selectedAddressId = 0;
        }
      }
    });
  }

  onAddressChange(event: any) {
    this.selectedAddressId = event.value;
  }
}
