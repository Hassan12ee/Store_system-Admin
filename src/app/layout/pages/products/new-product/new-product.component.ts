import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { ProductService } from '../../../../shared/services/product/product.service';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-new-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule,
        MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './new-product.component.html',
  styleUrl: './new-product.component.scss'
})
export class NewProductComponent implements OnInit{
    productForm!: FormGroup;
  photos: File[] = [];
  variantPhoto: File | null = null;
attributes: { name: string, values: { id: number, name: string, colorCode?: string }[] }[] = [];



  constructor(private fb: FormBuilder, private productService: ProductService) {}
  ngOnInit(): void {
    if( typeof localStorage!= 'undefined')
   localStorage.setItem('currentpage','/products/new')
      this.productForm = this.fb.group({
      name: ['', Validators.required],
      quantity: [0, Validators.required],
      warehouse_quantity: [0],
      specifications: [''],
      price: [0, Validators.required],
      weight: [''],
      dimensions: [''],
      warehouse_id: ['', Validators.required],
      sku: [''],
      attribute_values: [[]]
        
      
    });
    this.productService.getAllAttributesWithValues().subscribe((data) => {
  // تحويل الـ Object إلى Array مناسبة لـ mat-optgroup
  this.attributes = Object.entries(data).map(([attrName, values]) => {
    const castedValues = values as [string, number[]][]; // هنا حلينا المشكلة
    return {
      name: attrName,
      values: castedValues.map(v => ({
        name: v[0],
        id: v[1][0]
      }))
    };
  });
});

  }
  onPhotosSelected(event: any) {
    this.photos = Array.from(event.target.files);
  }

  onVariantPhotoSelected(event: any) {
    this.variantPhoto = event.target.files[0];
  }

  submit() {
    const formData = new FormData();

    // Append form fields
    Object.keys(this.productForm.controls).forEach(key => {
      const value = this.productForm.get(key)?.value;
      if (key === 'attribute_values') {
        value.forEach((val: number, index: number) => {
          formData.append(`attribute_values[${index}]`, val.toString());
        });
      } else {
        formData.append(key, value ?? '');
      }
    });

    // Append photos
    this.photos.forEach(photo => {
      formData.append('Photos[]', photo);
    });

    if (this.variantPhoto) {
      formData.append('variant_photo', this.variantPhoto);
    }
formData.forEach((value, key) => {
  console.log(key, value);
});

    this.productService.addNewProduct(formData).subscribe({
      next: (res) => console.log('✅ Product created', res),
      error: (err) => console.error('❌ Error', err)
    });
  }
}

