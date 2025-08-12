import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-user',
  standalone: true,
  imports: [],
  templateUrl: './new-user.component.html',
  styleUrl: './new-user.component.scss'
})
export class NewUserComponent implements OnInit{
  ngOnInit(): void {
    if( typeof localStorage!= 'undefined')
   localStorage.setItem('currentpage','/users/new')
  }
}
