import { Component, OnInit } from '@angular/core';
import { Category } from '../../../shared/interfaces/category';
import { CatgeoryService } from '../../../shared/services/catgeory/catgeory.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent  implements OnInit{
  categoryList !:Category[];
  isLoading:boolean =false;
  constructor(private _CatgeoryService:CatgeoryService){}
  ngOnInit(): void {
    if( typeof localStorage!= 'undefined')
   localStorage.setItem('currentpage','/Categories')
  this.getAllcategories();
  }
  getAllcategories()
  {
    this.isLoading=true;
  this._CatgeoryService.getAllCategories().subscribe({
    next : res =>{
      this.categoryList = res.data

      this.isLoading=false;
    },
    error:err =>{
      console.log(err);
      this.isLoading=false;
    }

  })
  }
}
