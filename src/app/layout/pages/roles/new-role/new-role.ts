import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-new-role',
    imports: [],
    templateUrl: './new-role.html',
    styleUrl: './new-role.css'
})
export class NewRoleComponent implements OnInit{
  ngOnInit(): void {
    if( typeof localStorage!= 'undefined')
   localStorage.setItem('currentpage','/roles/new')
  }
}
