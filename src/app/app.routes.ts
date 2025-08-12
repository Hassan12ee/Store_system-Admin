import { NotfoundComponent } from './layout/additions/notfound/notfound.component';
import { HomeComponent } from './layout/pages/home/home.component';
import { Routes } from '@angular/router';
import { ProductsComponent } from './layout/pages/products/products.component';
import { LoginComponent } from './layout/pages/login/login.component';
import { authGuard } from './shared/guards/auth.guard';
import { ForgetpasswordComponent } from './layout/additions/forgetpassword/forgetpassword.component';
import { verifyEmailComponent } from './layout/additions/verifyEmail/verifyEmail.component';
import { PermissionGuard } from './shared/guards/Permission.guard';
import { AllEmployeesComponent } from './layout/pages/employees/all-employees/all-employees.component';
import { NewEmployeeComponent } from './layout/pages/employees/new-employee/new-employee.component';

// Users
import { AllUsersComponent } from './layout/pages/users/all-users/all-users.component';
import { NewUserComponent } from './layout/pages/users/new-user/new-user.component';

// Storage
import { AllStorageComponent } from './layout/pages/storage/all-storage/all-storage.component';
import { NewStorageComponent } from './layout/pages/storage/new-storage/new-storage.component';

// Roles
import { AllRolesComponent } from './layout/pages/roles/all-roles/all-roles.component';
import { NewRoleComponent } from './layout/pages/roles/new-role/new-role.component';

// Products
import { AllProductsComponent } from './layout/pages/products/all-products/all-products.component';
import { NewProductComponent } from './layout/pages/products/new-product/new-product.component';

// Orders
import { AllOrdersComponent } from './layout/pages/orders/all-orders/all-orders.component';
import { NewOrderComponent } from './layout/pages/orders/new-order/new-order.component';
import { EditOrdersComponent } from './layout/pages/orders/edit-orders/edit-orders.component';


export const routes: Routes = [
  { path:"",redirectTo:"Home",pathMatch:"full"},
  { path: "Home", component: HomeComponent, canActivate :[authGuard], },
  { path: "Products",component:ProductsComponent, canActivate :[authGuard] },
  { path: "login",component:LoginComponent},
  { path: "ForGetPassword",component:ForgetpasswordComponent },
  { path: "verifyEmail",component:verifyEmailComponent },
  { path: 'employees', component: AllEmployeesComponent, canActivate :[authGuard] },
  { path: 'employees/new', component: NewEmployeeComponent, canActivate :[authGuard] },
  { path: 'users', component: AllUsersComponent , canActivate :[authGuard]},
  { path: 'users/new', component: NewUserComponent, canActivate :[authGuard] },
  { path: 'storage', component: AllStorageComponent , canActivate :[authGuard]},
  { path: 'storage/new', component: NewStorageComponent , canActivate :[authGuard]},
  { path: 'roles', component: AllRolesComponent, canActivate :[authGuard] },
  { path: 'roles/new', component: NewRoleComponent , canActivate :[authGuard]},
  { path: 'products', component: AllProductsComponent , canActivate :[authGuard]},
  { path: 'products/new', component: NewProductComponent, canActivate :[authGuard] },
  { path: 'orders', component: AllOrdersComponent, canActivate :[authGuard] },
  { path: 'orders/new', component: NewOrderComponent, canActivate :[authGuard] },
  { path: "orders/edit/:ID", component: EditOrdersComponent, canActivate :[authGuard] },
//{
//   path: 'products/edit',
//   component: EditProductComponent,
//   canActivate: [PermissionGuard],
//   data: { permission: 'edit products' }
// }
  {path:"**",component: NotfoundComponent}
];

