import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-all-storage',
    imports: [],
    templateUrl: './all-storage.html',
    styleUrl: './all-storage.css'
})
export class AllStorageComponent implements OnInit{
  ngOnInit(): void {
    if( typeof localStorage!= 'undefined')
   localStorage.setItem('currentpage','/storage')
  }
}
