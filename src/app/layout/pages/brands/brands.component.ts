import { brands } from '../../../shared/interfaces/brands';
import { BrandsService } from './../../../shared/services/brands/brands.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss'
})
export class BrandsComponent implements OnInit{
  isLoading:boolean =false;
  brandsList!:brands[];
constructor(private _BrandsService:BrandsService) {}
  ngOnInit(): void {
    if( typeof localStorage!= 'undefined')
   localStorage.setItem('currentpage','/Brands');
    this. getAllBrands();
  }


  getAllBrands()
  {
    this.isLoading=true;
  this._BrandsService.getAllBrands().subscribe({
    next : res =>{
      this.brandsList= res.data

      this.isLoading=false;
    },
    error:err =>{
      console.log(err);
      this.isLoading=false;
    }

  })
  }
}
