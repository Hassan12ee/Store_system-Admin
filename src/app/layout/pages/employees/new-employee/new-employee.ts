import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-new-employee',
    imports: [],
    templateUrl: './new-employee.html',
    styleUrl: './new-employee.css'
})
export class NewEmployeeComponent implements OnInit {
  ngOnInit(): void {
    if( typeof localStorage!= 'undefined')
   localStorage.setItem('currentpage','/employees/new')
  }
}
