import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-employee',
  standalone: true,
  imports: [],
  templateUrl: './new-employee.component.html',
  styleUrl: './new-employee.component.scss'
})
export class NewEmployeeComponent implements OnInit {
  ngOnInit(): void {
    if( typeof localStorage!= 'undefined')
   localStorage.setItem('currentpage','/employees/new')
  }
}
