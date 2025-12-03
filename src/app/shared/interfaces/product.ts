// inputs data
export interface InAddProduct {
  name: string;
  quantity: number;
  warehouse_quantity?: number;
  specifications?: string;
  price: number;
  weight?: string;
  dimensions?: string;
  warehouse_id: string;
  sku?: string;
  attribute_values?: { id: number, value: string }[];
  photos?: File[];
  variant_photo?: File;
  main_image?: File;
}
// outputs data
export interface AddProduct {
  data:    Data;
  message: string;
  status:  number;
}

export interface Data {
  name:               string;
  barcode:            string;
  Photos:             any[];
  warehouse_quantity: string;
  specifications:     string;
  weight:             string;
  dimensions:         string;
  warehouse_id:       string;
  updated_at:         Date;
  created_at:         Date;
  id:                 number;
  variants:           Variant[];
}

export interface Variant {
  id:               number;
  product_id:       number;
  sku:              null;
  price:            string;
  quantity:         number;
  photo:            null;
  created_at:       Date;
  updated_at:       Date;
  attribute_values: AttributeValue[];
}

export interface AttributeValue {
  id:           number;
  attribute_id: number;
  value:        string;
  created_at:   Date;
  updated_at:   Date;
  attribute:    Attribute;
}

export interface Attribute {
  id:         number;
  name:       string;
  created_at: Date;
  updated_at: Date;
}








export interface ProductsResponse {
  data:    Data;
  message: string;
  status:  number;
}

export interface Data {
  current_page:  number;
  per_page:      number;
  total:         number;
  last_page:     number;
  next_page_url: null;
  prev_page_url: null;
  products:      Product[];
}

export interface Product {
  sku_id:                 number;
  product_id:             number;
  name_Ar:                string;
  name_En:                string;
  sku_Ar:                 string;
  sku_En:                 string;
  Photos:                 any[];
  main_photo:             null;
  photo:                  null;
  price:                  string;
  quantity:               number;
  warehouse_qty:          number;
  specifications:         string;
  dimensions:             string;
  warehouse_id:           number;
  barcode:                string;
  values_with_attributes: ValuesWithAttribute[];
  brand:                  null;
  category:               null;
  created_at:             Date;
  updated_at:             Date;
}

export interface ValuesWithAttribute {
  value_id:       number;
  attribute_id:   number;
  attribute_name: string;
  value:          string;
}
