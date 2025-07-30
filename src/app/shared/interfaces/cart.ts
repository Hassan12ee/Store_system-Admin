export interface CartRes {
  items: Item[];
  total: number;
  message: string;
}

export interface Item {
  id:             string;
  user_id:        string;
  product_id:     string;
  quantity:       number;
  created_at:     Date;
  updated_at:     Date;
  name:           string;
  main_photo:     string;
  specifications: string;
  price:          string;
}

