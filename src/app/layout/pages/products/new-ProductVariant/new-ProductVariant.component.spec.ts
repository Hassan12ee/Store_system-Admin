import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewProductVariantComponent } from './new-ProductVariant.component';

describe('NewProductComponent', () => {
  let component: NewProductVariantComponent;
  let fixture: ComponentFixture<NewProductVariantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewProductVariantComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewProductVariantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
