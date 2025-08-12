import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-all-storage',
  standalone: true,
  imports: [],
  templateUrl: './all-storage.component.html',
  styleUrl: './all-storage.component.scss'
})
export class AllStorageComponent implements OnInit{
  ngOnInit(): void {
    if( typeof localStorage!= 'undefined')
   localStorage.setItem('currentpage','/storage')
  }
}
