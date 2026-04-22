import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { ProductService } from '../../../../shared/services/product/product.service';
import {} from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
@Component({
    selector: 'app-new-product',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        // TODO: `HttpClientModule` should not be imported into a component directly.
        // Please refactor the code to add `provideHttpClient()` call to the provider list in the
        // application bootstrap logic and remove the `HttpClientModule` import from this component.
        HttpClientModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatRadioModule,
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
      name_Ar: ['', Validators.required],
      name_En: ['', Validators.required],
      specifications: [''],
      brand_id: [''],
      category_id: [''],
    
      sku_Ar: ['', Validators.required],
      sku_En: ['', Validators.required],
      price: [0, Validators.required],
      quantity: [0, Validators.required],
      dimensions: [''],
      weight: [''],
      warehouse_id: ['', Validators.required],
      warehouse_quantity: [0],
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
  previewImages: string[] = [];
  previewImage: string[] = [];
  onPhotosSelected(event: any) {
    this.photos = Array.from(event.target.files);
      const files: FileList = event.target.files;
  this.previewImages = []; // clear old preview

  Array.from(files).forEach(file => {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.previewImages.push(e.target.result);  // Base64 image
    };

    reader.readAsDataURL(file);
  });
  }

  onVariantPhotoSelected(event: any) {
    this.variantPhoto = event.target.files[0];
          const files: FileList = event.target.files;
  this.previewImage = []; // clear old preview

  Array.from(files).forEach(file => {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.previewImage.push(e.target.result);  // Base64 image
    };

    reader.readAsDataURL(file);
  });
  }

  submit() {
    const formData  = new FormData();

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

