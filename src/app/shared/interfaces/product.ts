export interface Products {
  current_page:  number;
  per_page:      number;
  total:         number;
  last_page:     number;
  next_page_url: null;
  prev_page_url: null;
  products:      Product[];
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
