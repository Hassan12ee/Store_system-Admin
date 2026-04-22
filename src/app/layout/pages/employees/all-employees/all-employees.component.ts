import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-all-employees',
    imports: [],
    templateUrl: './all-employees.component.html',
    styleUrl: './all-employees.component.scss'
})
export class AllEmployeesComponent implements OnInit{
  ngOnInit(): void {
    if( typeof localStorage!= 'undefined')
   localStorage.setItem('currentpage','/employees')
  }
}
