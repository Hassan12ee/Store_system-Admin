import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-all-roles',
    imports: [],
    templateUrl: './all-roles.html',
    styleUrl: './all-roles.css'
})
export class AllRolesComponent implements OnInit{
  ngOnInit(): void {
    if( typeof localStorage!= 'undefined')
   localStorage.setItem('currentpage','/roles')
  }
}
