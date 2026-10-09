import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-new-storage',
    imports: [],
    templateUrl: './new-storage.html',
    styleUrl: './new-storage.css'
})
export class NewStorageComponent implements OnInit{
  ngOnInit(): void {
    if( typeof localStorage!= 'undefined')
   localStorage.setItem('currentpage','/storage/new')
  }
}
