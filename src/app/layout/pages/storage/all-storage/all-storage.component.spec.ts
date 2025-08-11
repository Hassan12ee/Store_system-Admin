import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllStorageComponent } from './all-storage.component';

describe('AllStorageComponent', () => {
  let component: AllStorageComponent;
  let fixture: ComponentFixture<AllStorageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllStorageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllStorageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
