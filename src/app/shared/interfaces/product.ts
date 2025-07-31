export interface Products {
  data: Data;
  message: string;
  status: number;
}

export interface Data {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  next_page_url: null;
  prev_page_url: null;
  products: Product[];
}

export interface Product {
  id: number;
  name: string;
  Photos: string[];
  main_photo: null | string;
  quantity: number;
  specifications: string;
  price: string;
  size: string;
  barcode: null | string;
  dimensions: string;
  warehouse_id: number;
  created_at: string;
  updated_at: string;
}