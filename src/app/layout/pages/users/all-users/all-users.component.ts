import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-all-users',
  standalone: true,
  imports: [],
  templateUrl: './all-users.component.html',
  styleUrl: './all-users.component.scss'
})
export class AllUsersComponent implements OnInit{
  ngOnInit(): void {
    if( typeof localStorage!= 'undefined')
   localStorage.setItem('currentpage','/users')
  }
}
