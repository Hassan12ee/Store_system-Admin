import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // جاي من الراوت نفسه
  const allowedRoles = route.data['roles'] as string[];

  const userData = authService.userData.getValue();

  if (!userData) {
    router.navigate(['/login']);
    return false;
  }

  const userRoles = userData.roles || [];

  const hasRole = allowedRoles.some(role => userRoles.includes(role));

  if (hasRole) {
    return true;
  }

  router.navigate(['/unauthorized']);
  return false;
};
