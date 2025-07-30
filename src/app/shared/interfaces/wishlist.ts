export interface Wishlist {
  products: Products[];
  message:  string;
}

export interface Products {
  id:         number;
  user_id:    number;
  product_id: string;
  created_at: Date;
  updated_at: Date;
  product:   Product;
}

export interface Product {
  id:             string;
  name:           string;
  Photos:         string[];
  main_photo:     null;
  quantity:       number;
  specifications: string;
  price:          string;
  size:           string;
  dimensions:     string;
  warehouse_id:   number;
  created_at:     Date;
  updated_at:     Date;
}
