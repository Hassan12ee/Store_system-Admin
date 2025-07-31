import { NotfoundComponent } from './layout/additions/notfound/notfound.component';
import { HomeComponent } from './layout/pages/home/home.component';
import { Routes } from '@angular/router';
import { ProductsComponent } from './layout/pages/products/products.component';
import { CategoriesComponent } from './layout/pages/categories/categories.component';
import { BrandsComponent } from './layout/pages/brands/brands.component';
import { RegisterComponent } from './layout/pages/register/register.component';
import { LoginComponent } from './layout/pages/login/login.component';
import { authGuard } from './shared/guards/auth.guard';
import { ForgetpasswordComponent } from './layout/additions/forgetpassword/forgetpassword.component';
import { ProductdetailsComponent } from './layout/additions/productdetails/productdetails.component';
import { ShippingAddressComponent } from './layout/additions/shipping-address/shipping-address.component';
import { verifyEmailComponent } from './layout/additions/verifyEmail/verifyEmail.component';
import { OrderComponent } from './layout/pages/order/order.component';


export const routes: Routes = [
  {path:"",redirectTo:"Home",pathMatch:"full"},
  {path: "Home", component: HomeComponent, canActivate :[authGuard], },
  {path: "Products",component:ProductsComponent, canActivate :[authGuard] },
  {path: "Categories",component:CategoriesComponent, canActivate :[authGuard] },
  {path: "shippingAddress",component:ShippingAddressComponent, canActivate :[authGuard] },
  {path: "Brands",component:BrandsComponent , canActivate :[authGuard] },
  {path: "Register",component:RegisterComponent , canActivate :[authGuard] },
  {path: "login",component:LoginComponent},
  {path: "ForGetPassword",component:ForgetpasswordComponent },
   {path: "verifyEmail",component:verifyEmailComponent },
  {path:"productdetails/:ID",component:ProductdetailsComponent, canActivate :[authGuard]},
   {path:"order",component:OrderComponent, canActivate :[authGuard]},

  {path:"**",component: NotfoundComponent}
];
