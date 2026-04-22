import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OrderService } from './../../../../shared/services/order/order.service';
import { ProductService } from './../../../../shared/services/product/product.service';

@Component({
    selector: 'app-edit-orders',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        // TODO: `HttpClientModule` should not be imported into a component directly.
        // Please refactor the code to add `provideHttpClient()` call to the provider list in the
        // application bootstrap logic and remove the `HttpClientModule` import from this component.
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
    templateUrl: './edit-orders.component.html',
    styleUrls: ['./edit-orders.component.scss']
})
export class EditOrdersComponent implements OnInit {
  Math = Math;
  id: string = '';
  order: any;
  products: any[] = [];
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
    status: [''],
    first_name: [''],
    last_name: [''],
    email: [''],
    phone: [''],
    address_id: [''],
    governorate: [''],
    city: [''],
    street: [''],
    comments: [''],
    order_items: this.fb.array([this.createItem()])
  });

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
  
      this.route.params.subscribe(params => {
        this.id = params['ID'];
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('currentpage', `/orders/edit/${this.id}`);
        }
        this.getOrderById().then(() => {
      
          this.loadProducts();
          this.loadGovernorate();
        });
      });

  this.form.valueChanges.subscribe(() => this.calculateTotal());
  }

  createItem(): FormGroup {
    return this.fb.group({
      id: [null], // id الخاص بـ order_details
      product_id: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]],
    });
  }

  get orderItems(): FormArray {
    return this.form.get('order_items') as FormArray;
  }

  getOrderById():  Promise<void> {
    return new Promise((resolve, reject) => {
    this.loading = true;
    this.orderService.getOrderById(this.id).subscribe({
      next: res => {
        this.order = res.data;
        // console.log(this.order.items[0].id);
        if (res.data.customer?.id) {
          this.userId = res.data.customer.id;
          this.getUserAddresses(res.data.customer.id);
        }
        this.fillFormWithData(res.data);
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

  fillFormWithData(order: any): void {
      this.form.patchValue({
        status: order.status || '',
        first_name: order.customer.FristName || '',
        last_name: order.customer.LastName || '',
        email: order.customer.email || '',
        phone: order.customer.Phone || ''
      });

    // مسح العناصر القديمة
    this.orderItems.clear();

    order.items.forEach((item: any) => {
      const group = this.fb.group({
        id: [item.id],
        product_id: [item.product_variants_id, Validators.required],
        quantity: [item.quantity, [Validators.required, Validators.min(1)]],
        price: [item.price],
      });

      this.setupProductPriceListener(group);
      this.orderItems.push(group);
    });

    // تحديث userAddresses و selectedAddressId
    if (order.address) {
      this.userAddresses = [order.address];
      this.selectedAddressId = order.address.id;
    }

    // تحديث الأسعار بعد تحميل المنتجات
    this.orderItems.controls.forEach(item => {
      const productId = item.get('product_id')?.value;
      const product = this.getProduct(productId);
      if (product) item.get('price')?.setValue(product.price, { emitEvent: false });
    });

    this.calculateTotal();
  }

  addItem(productId?: number): void {
    if (productId && this.isProductSelected(productId, -1)) {
      this.message = 'هذا المنتج مضاف بالفعل في الطلب';
      return;
    }
    const item = this.createItem();
    if (productId) {
      item.get('product_id')?.setValue(productId);
    }
    this.setupProductPriceListener(item);
    this.orderItems.push(item);
  }

  removeItem(index: number): void {
    const itemGroup = this.orderItems.at(index) as FormGroup;
    const orderDetailsId = itemGroup.get('id')?.value;

    // لو العنصر له id من الداتا بيز → احذفه من السيرفر
    if (orderDetailsId) {
      this.orderService.deleteProductFromOrder(orderDetailsId).subscribe({
        next: () => {
          // بعد الحذف من السيرفر نحذفه من الفورم
          this.orderItems.removeAt(index);
          this.calculateTotal();
          this.message = 'تم حذف المنتج من الطلب بنجاح';
        },
        error: err => {
          console.error(err);
          this.message = 'حدث خطأ أثناء حذف المنتج من الطلب';
        }
      });
    } else {
      // عنصر جديد (لم يُحفظ بعد) → احذفه فقط من الفورم
      this.orderItems.removeAt(index);
      this.calculateTotal();
    }
  }

  loadGovernorate(): void {
    this.orderService.getgovernorates().subscribe({
      next: res => {
        this.Governorates = res.data;
        },
      error: err => {
        console.log(err);
      }
    });
  }

  onGovernorateChange(governorateId: number): void {
    // تفريغ المدن القديمة
    this.Cities = [];


    if (!governorateId) return;

    // تحميل المدن حسب المحافظة
    this.orderService.getCitiesByGovernorate(governorateId).subscribe({
      next: (res) => {
        this.Cities = res.data || [];
      },
      error: (err) => {
        console.error('Error loading cities:', err);
      }
    });
  }

  loadProducts():void {
    
      this.productService.getallproducts().subscribe({
        next: res => {
          this.products = res.data.products || [];

          // تعديل الكمية مؤقتًا بناءً على الكمية في الطلب
          if (this.order?.items?.length) {
            this.order.items.forEach((item: any) => {
              const product = this.products.find(p => p.sku_id == item.product_id);
              if (product) {
                product.quantity = (product.quantity || 0) + item.quantity;
              }
            });
          }

          // تحديث الأسعار للفورم
          this.orderItems.controls.forEach(item => {
            const productId = (item as FormGroup).get('product_id')?.value;
            const product = this.getProduct(productId);
            if (product) {
              (item as FormGroup).get('price')?.setValue(product.price, { emitEvent: false });
            }
          });
         
        },
        error: err => {
          console.error(err);
          
        }
      });
    ;
  }

  getProduct(productId: number) {
    return this.products.find(p => p.sku_id == productId);
  }

  isProductSelected(productId: number, currentIndex: number): boolean {
    return this.orderItems.controls.some((item, idx) =>
      idx !== currentIndex && item.get('product_id')?.value == productId
    );
  }

  calculateTotal(): void {
    this.totalPrice = this.orderItems.controls.reduce((sum, item) => {
      if (item.get('_delete')?.value) return sum; // تجاهل المحذوف
      const quantity = item.get('quantity')?.value || 0;
      const price = item.get('price')?.value || 0;
      return sum + quantity * price;
    }, 0);
    this.totalPrice = Number(this.totalPrice.toFixed(2));
  }

  setupProductPriceListener(item: FormGroup): void {
    // ضبط القيمة الأولية عند تحميل الأوردر
    let prevValue = item.get('product_id')?.value;

    item.get('product_id')?.valueChanges.subscribe(productId => {
      const index = this.orderItems.controls.indexOf(item);

      // منع اختيار المنتج نفسه في عنصر آخر
      if (this.isProductSelected(productId, index)) {
        this.message = 'هذا المنتج مضاف بالفعل';
        item.get('product_id')?.setValue(prevValue, { emitEvent: false });
        return;
      }

      prevValue = productId;

      const product = this.getProduct(productId);
      item.get('price')?.setValue(product ? product.price : 0, { emitEvent: false });

      // ضبط الكمية لتكون أقل من المخزون
      const quantityControl = item.get('quantity');
      if (quantityControl) {
        const qty = quantityControl.value;
        const maxQty = product?.quantity || 0;
        if (qty > maxQty) quantityControl.setValue(maxQty, { emitEvent: false });
      }

      this.calculateTotal();
    });
  }

  getUserAddresses(userId: number): void {
    this.orderService.getUserAddresses(userId).subscribe({
      next: res => {
        this.userAddresses = res.data || [];
        if (!this.selectedAddressId && this.userAddresses.length) {
          this.selectedAddressId = this.userAddresses[0].id;
        }
      },
      error: err => console.error(err)
    });
  }

  addNewAddressForUser(): void {
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

    this.orderService.addAddress(this.userId, addressData).subscribe({
      next: res => {
        if (res?.data?.id) {
          this.message = 'تمت إضافة العنوان بنجاح';
          if (this.userId !== null)
            this.getUserAddresses(this.userId);
          this.selectedAddressId = res.data.id;
        }
      },
      error: err => {
        console.error(err);
        this.message = 'خطأ أثناء إضافة العنوان';
      }
    });
  }

  onAddressChange(event: any): void {
    this.selectedAddressId = event.value;
  }

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

    const itemsData = this.orderItems.controls.map(ctrl => ({
      id: ctrl.get('id')?.value || null,
      product_id: ctrl.get('product_id')?.value,
      quantity: ctrl.get('quantity')?.value,
      price: ctrl.get('price')?.value,
    }));

    const orderData = {
      status: this.form.get('status')?.value,
      address_id: this.selectedAddressId,
      customer: customerData,
      items: itemsData
    };

    this.orderService.updateOrder(this.id, orderData).subscribe({
      next: res => {
        this.loading = false;
        
          this.message = 'تم تحديث الطلب بنجاح';
          this.getOrderById();
       
      },
      error: err => {
        console.error(err);
        this.loading = false;
        this.message = 'خطأ أثناء تحديث الطلب';
      }
    });
  }

  getProductName(index: number): string {
    const productId = this.orderItems.at(index).get('product_id')?.value;
    if (!productId || !this.products.length) return 'Select Product';
    
    const product = this.getProduct(productId);
    return product ? product.name_Ar + ' ' + product.sku_Ar : 'Select Product';
  }


}
