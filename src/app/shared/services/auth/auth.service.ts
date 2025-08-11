import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { jwtDecode } from "jwt-decode";

import { code, forgotpasswordData, loginData, RegisterData } from '../../interfaces/data';
import { Enviroment } from '../../../base/Enviroment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isBrowser: boolean;
  userData: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(
    private _HttpClient: HttpClient,
    private _Router: Router,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    // لو شغال على المتصفح و فيه توكن
    if (this.isBrowser) {
      const token = localStorage.getItem('userToken');
      if (token) {
        this.deCodeUserData();
        const currentPage = localStorage.getItem('currentpage') || '/';
        this._Router.navigate([currentPage]);
      }
    }
  }

  // إرجاع الـ headers مع التوكن
  private getAuthHeaders() {
    return {
      Authorization: localStorage.getItem('userToken') || ''
    };
  }

  // تسجيل مستخدم جديد
  signUp(data: RegisterData): Observable<any> {
    return this._HttpClient.post(`${Enviroment.baseUrl}/api/auth/register`, data);
  }

  // إرسال OTP للنسيان
  Forgetpassword(data: forgotpasswordData): Observable<any> {
    return this._HttpClient.post(`${Enviroment.baseUrl}/api/auth/password/send-otp`, data);
  }

  // تحقق من OTP
  verifyResetCode(data: code): Observable<any> {
    return this._HttpClient.post(`${Enviroment.baseUrl}/api/auth/password/verify-otp`, data);
  }

  // إعادة تعيين كلمة المرور
  resetPassword(data: code): Observable<any> {
    return this._HttpClient.post(`${Enviroment.baseUrl}/api/auth/password/reset`, data);
  }

  // تسجيل الدخول
  signIn(data: loginData): Observable<any> {
    return this._HttpClient.post(`${Enviroment.baseUrl}/api/auth/login`, data);
  }

  // تحقق من OTP البريد
  verifyemailotp(data: loginData): Observable<any> {
    return this._HttpClient.post(`${Enviroment.baseUrl}/api/auth/verify`, data);
  }

  // إعادة إرسال OTP
  resendemailotp(data: code): Observable<any> {
    return this._HttpClient.post(`${Enviroment.baseUrl}/api/auth/otp/resend`, data);
  }

  // فك تشفير بيانات المستخدم
  deCodeUserData() {
    if (!this.isBrowser) return;

    const token = localStorage.getItem('userToken');
    if (token) {
      const decoded = jwtDecode(token);
      this.userData.next(decoded);
      console.log("Decoded User Data:", decoded);
    }
  }

  // الحصول على بيانات المستخدم الحالي
  getCurrentUser(): Observable<any> {
    return this._HttpClient.get<any>(`${Enviroment.baseUrl}/api/auth/me`, {
      headers: this.getAuthHeaders()
    });
  }

  // تسجيل الخروج
  logOut() {
    if (this.isBrowser) {
      localStorage.removeItem("userToken");
      localStorage.removeItem("roles");
      localStorage.removeItem("email_verified_at");
      localStorage.removeItem("email");
      localStorage.removeItem("Name");
    }
    this.userData.next(null);
    this._Router.navigate(['/login']);
  }
}

  



