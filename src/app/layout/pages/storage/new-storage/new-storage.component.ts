import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-storage',
  standalone: true,
  imports: [],
  templateUrl: './new-storage.component.html',
  styleUrl: './new-storage.component.scss'
})
export class NewStorageComponent implements OnInit{
  ngOnInit(): void {
    if( typeof localStorage!= 'undefined')
   localStorage.setItem('currentpage','/storage/new')
  }
}
