import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-role',
  standalone: true,
  imports: [],
  templateUrl: './new-role.component.html',
  styleUrl: './new-role.component.scss'
})
export class NewRoleComponent implements OnInit{
  ngOnInit(): void {
    if( typeof localStorage!= 'undefined')
   localStorage.setItem('currentpage','/roles/new')
  }
}
