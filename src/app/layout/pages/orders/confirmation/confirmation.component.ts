import { address } from './../../../../shared/interfaces/data';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OrderService } from '../../../../shared/services/order/order.service';
import { ProductService } from '../../../../shared/services/product/product.service';

import { Console } from 'console';
import e from 'express';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [
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
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class confirmationComponent implements OnInit {
  Math = Math;
  order: any;
  id: any ;
  secendTry: boolean = false;
  session_id:string='';
  products: any[] = [];
  userAddresses: any[] = [];
  Cities: any[] = [];
  Governorates: any[] = [];
  selectedAddressId: number = 0;
  userId: number | null = null;
  totalPrice: number = 0;
  message_order = '';
  message_call = '';
  message_whatsapp = '';
  message_addres = '';
  loading = false;
  confirmationMessage: string = '';
  copied = false;
  ConfirmationStatus = 'go';
  fb = inject(FormBuilder);
  http = inject(HttpClient);

  form: FormGroup = this.fb.group({
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
calling_AttemptForm: FormGroup = this.fb.group({
  order_id: [''],
  method: [''],
  status: ['', Validators.required],
  attempt_number: [''],
});

whatsapp_AttemptForm: FormGroup = this.fb.group({
  order_id: [''],
  method: ['' ],
  status: ['', Validators.required],
  attempt_number: [''],
});


  endConfirmationForm = new FormGroup({
  status: new FormControl('', Validators.required),
  ConfirmationStatus: new FormControl('go', Validators.required),
});

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
  
      this.route.params.subscribe(params => {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('currentpage', `/orders/confirmation`);
        }
        this.ConfirmOrderById().then(() => {
      
          this.loadProducts();
          this.loadGovernorate();
          this.buildConfirmationMessage();
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

  ConfirmOrderById():  Promise<void> {
    return new Promise((resolve, reject) => {
    this.loading = true;
    this.orderService.Confirmation().subscribe({
      next: res => {
        this.order = res.data;
      
        if (res.data.customer?.id) {
          this.userId = res.data.customer.id;
          this.getUserAddresses(res.data.customer.id);
        }
        this.secendTry=res.secendTry;
        this.session_id=res.session_id;
        this.id=res.data.order_id;
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
      this.message_order = 'هذا المنتج مضاف بالفعل في الطلب';
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
          this.message_order = 'تم حذف المنتج من الطلب بنجاح';
        },
        error: err => {
          console.error(err);
          this.message_order = 'حدث خطأ أثناء حذف المنتج من الطلب';
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
        this.message_order = 'هذا المنتج مضاف بالفعل';
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
      this.message_addres = 'لا يوجد مستخدم محدد';
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
          this.message_addres = 'تمت إضافة العنوان بنجاح';
          if (this.userId !== null)
            this.getUserAddresses(this.userId);
          this.selectedAddressId = res.data.id;
        }
      },
      error: err => {
        console.error(err);
        this.message_addres = 'خطأ أثناء إضافة العنوان';
      }
    });
  }

  onAddressChange(event: any): void {
    this.selectedAddressId = event.value;
  }
  calling_Attempt(): void {
    if (this.calling_AttemptForm.invalid) {
      this.message_call = 'يرجى ملء جميع الحقول المطلوبة';
      return;
    }
    var logAttempt: any = {};
    this.loading = true;
    if (this.secendTry){
      const logAttempt = {
      order_id: this.id,
      status: this.calling_AttemptForm.get('status')?.value || '',
      method:'call',
      attempt_number:2
      };
    }else{
      logAttempt = {
      order_id: this.id,
      status: this.calling_AttemptForm.get('status')?.value || '',
      method:'call',
      attempt_number:1
      };
    }
        this.orderService.logAtttempt(logAttempt).subscribe({
      next: res => {
        this.loading = false;

          this.message_call = 'تم إرسال محاولة التأكيد بنجاح';
        this.calling_AttemptForm.reset();
       
      },
      error: err => {
        console.error(err);
        this.loading = false;
        this.message_call = 'خطأ أثناء إرسال محاولة التأكيد';
      }
    });
  }

  buildConfirmationMessage() {
    const customerName = `${this.order.customer.FristName} ${this.order.customer.LastName}`;
  const orderItems = this.order.items.map((i: { product_name: string; quantity: number }) => `${i.product_name} × ${i.quantity}`).join(', ');
    const orderTotal = this.order.total_price + ' جنيه';
    const paymentMethod = 'كاش عند الاستلام';
    const fullAddress = ` ${this.order.address.governorate.governorate_name_ar}
    ,${this.order.address.city.city_name_ar} ,${this.order.address.street}`;
    const storeName = 'متجر جلاكسي';

    this.confirmationMessage = `
  أهلاً ${customerName}،
  حضرتك قمت بطلب: ${orderItems}
  قيمة الطلب: ${orderTotal}
  طريقة الدفع: ${paymentMethod}
  هيتم الشحن على العنوان:
  ${fullAddress}

  يُرجى تأكيد الطلب بالرد بـ "مؤكد" أو التعديل لو في حاجة محتاجة تتغير.
  شكراً لاختيارك ${storeName}
    `;
    
  }

  copyMessage() {
    navigator.clipboard.writeText(this.confirmationMessage).then(() => {
      this.copied = true;
      setTimeout(() => this.copied = false, 2000);
    });
  }

  whatsapp_Attempt(): void {
    this.message_whatsapp = 'تم إرسال محاولة التأكيد بنجاح';
        if (this.whatsapp_AttemptForm.invalid) {
      this.message_whatsapp = 'يرجى ملء جميع الحقول المطلوبة';
      return;
    }
    var logAttempt: any = {};
    this.loading = true;
    if (this.secendTry){
      const logAttempt = {
      order_id: this.id,
      status: this.whatsapp_AttemptForm.get('status')?.value || '',
      method:'whatsapp',
      attempt_number:2
      };
    }else{
      logAttempt = {
      order_id: this.id,
      status: this.whatsapp_AttemptForm.get('status')?.value || '',
      method:'whatsapp',
      attempt_number:1
      };
    }
        this.orderService.logAtttempt(logAttempt).subscribe({
      next: res => {
        this.loading = false;
        
          this.message_whatsapp = 'تم إرسال محاولة التأكيد بنجاح';
         this.whatsapp_AttemptForm.reset();
       
      },
      error: err => {
        console.error(err);
        this.loading = false;
        this.message_whatsapp = 'خطأ أثناء إرسال محاولة التأكيد';
      }
    });
  }

  endConfirmation(): void {
    if (this.endConfirmationForm.invalid) {
      this.message_whatsapp = 'يرجى ملء جميع الحقول المطلوبة';
      return;
    }

    this.loading = true;

    const logAttempt = {
      session_id: this.session_id,
      final_status: this.endConfirmationForm.get('status')?.value || '',
    };

    const isGo = this.endConfirmationForm.get('ConfirmationStatus')?.value === 'go';

    this.orderService.endConfirmation(logAttempt).subscribe({
      next: res => {
        this.loading = false;
        this.message_whatsapp = 'تم إرسال محاولة التأكيد بنجاح';
        this.endConfirmationForm.reset();
        if (isGo) {
          this.ConfirmOrderById();
        }
      },
      error: err => {
        console.error(err);
        this.loading = false;
        this.message_whatsapp = 'خطأ أثناء إرسال محاولة التأكيد';
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.message_order = 'يرجى ملء جميع الحقول المطلوبة';
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
      address_id: this.selectedAddressId,
      customer: customerData,
      items: itemsData
    };

    this.orderService.updateOrder(this.id, orderData).subscribe({
      next: res => {
        this.loading = false;
        
          this.message_order = 'تم تحديث الطلب بنجاح';
          this.ConfirmOrderById();
          this.buildConfirmationMessage();
       
      },
      error: err => {
        console.error(err);
        this.loading = false;
        this.message_order = 'خطأ أثناء تحديث الطلب';
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
