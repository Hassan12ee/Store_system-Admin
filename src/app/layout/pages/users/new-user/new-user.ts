import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-new-user',
    imports: [],
    templateUrl: './new-user.html',
    styleUrl: './new-user.css'
})
export class NewUserComponent implements OnInit{
  ngOnInit(): void {
    if( typeof localStorage!= 'undefined')
   localStorage.setItem('currentpage','/users/new')
  }
}
