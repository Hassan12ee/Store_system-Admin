import { ActivatedRouteSnapshot, CanActivate,   Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { inject, Injectable } from '@angular/core';
import { App } from '../../app';


@Injectable({ providedIn: 'root' })
export class PermissionGuard implements CanActivate {
  constructor(private auth: App, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredPermission = route.data['permission'] as string;

    if (this.auth.hasPermission(requiredPermission)) {
      return true;
    }

    this.router.navigate(['/unauthorized']);
    return false;
  }
}
