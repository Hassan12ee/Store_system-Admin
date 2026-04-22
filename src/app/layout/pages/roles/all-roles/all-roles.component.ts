import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-all-roles',
    imports: [],
    templateUrl: './all-roles.component.html',
    styleUrl: './all-roles.component.scss'
})
export class AllRolesComponent implements OnInit{
  ngOnInit(): void {
    if( typeof localStorage!= 'undefined')
   localStorage.setItem('currentpage','/roles')
  }
}
