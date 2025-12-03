export interface Order {
}
export interface OrderRes {
  status:  string;
  session: Session;
}

export interface Session {
  url:         string;
  success_url: string;
  cancel_url:  string;
}
export interface responseGovernorates {
  status: boolean;
  data:   Governorate[];
}

export interface Governorate {
  id:                  number;
  province_id:         number;
  governorate_name_ar: string;
  governorate_name_en: string;
}
export interface ResponseCities {
  status: boolean;
  data:   Cities[];
}

export interface Cities {
  id:             number;
  governorate_id: number;
  city_name_ar:   string;
  city_name_en:   string;
}
