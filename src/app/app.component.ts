import { ProductService } from './shared/services/product/product.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { AuthService } from './shared/services/auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'freshcart';
  isLogin = false;
  name = '';
  permissions: string[] = [];
  roles: string[] = [];

  private subscriptions: Subscription[] = [];

  constructor(public _AuthService: AuthService) {}

  ngOnInit(): void {
    // متابعة بيانات المستخدم
    const sub = this._AuthService.userData.subscribe(user => {
      if (user) {
        this.isLogin = true;
        this.name = localStorage.getItem("Name") || '';
        this.getAllPermission();
      } else {
        this.isLogin = false;
        this.permissions = [];
        this.roles = [];
      }
    });
    this.subscriptions.push(sub);
  }

  getAllPermission() {
    const sub = this._AuthService.getCurrentUser().subscribe({
      next: res => {
        
        this.permissions = res.permissions || [];
        this.roles = res.roles || [];
      },
      error: err => {
        console.error('Error fetching user data:', err);
      }
    });
    this.subscriptions.push(sub);
  }

  hasPermission(permission: string): boolean {
    return this.permissions.includes(permission);
  }

  hasRole(role: string): boolean {
    return this.roles.includes(role);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
