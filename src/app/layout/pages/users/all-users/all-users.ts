import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-all-users',
    imports: [],
    templateUrl: './all-users.html',
    styleUrl: './all-users.css'
})
export class AllUsersComponent implements OnInit{
  ngOnInit(): void {
    if( typeof localStorage!= 'undefined')
   localStorage.setItem('currentpage','/users')
  }
}
