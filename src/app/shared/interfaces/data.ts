export interface RegisterData {
    "name":string,
    "email":string,
    "password":string,
    "rePassword":string,
    "phone":string,
}
export interface loginData {
  "email":string,
  "password":string,
}

export interface forgotpasswordData {
  "email":string,
}
export interface code {
  "email":string,
  "otp":string,
}
export interface newPassword {
  "email":string,
  "newPassword":string,
}
export interface address {
  "details":string,
  "phone":string,
  "city":string,
}
export interface wishlist{
  "productId":string
}
