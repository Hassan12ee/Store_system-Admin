
export interface Brandsres {
  results:  number;
  metadata: Metadata;
  data:     brands[];
}

export interface brands {
  _id:       string;
  name:      string;
  slug:      string;
  image:     string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Metadata {
  currentPage:   number;
  numberOfPages: number;
  limit:         number;
  nextPage:      number;
}
