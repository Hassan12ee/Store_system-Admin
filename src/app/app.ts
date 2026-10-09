import { Component, signal,OnInit, OnDestroy,Inject, PLATFORM_ID } from '@angular/core';
import { ProductService } from './shared/services/product/product.service';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule,isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from './shared/services/auth/auth.service';
import { initFlowbite } from 'flowbite';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet,RouterLink, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('Bn_abdallah_store');
    isLogin = false;
  name = '';
  permissions: string[] = [];
  roles: string[] = [];

  private subscriptions: Subscription[] = [];

  constructor(public _AuthService: AuthService, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    // متابعة بيانات المستخدم
   if (isPlatformBrowser(this.platformId)) {
      import('flowbite').then(({ initFlowbite }) => {
        initFlowbite();
      });
    }
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
