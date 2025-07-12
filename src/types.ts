export interface Quote {
  id: string;
  name: string;
  phone: string;
  car_model: string;
  status: 'pending' | 'contacted' | 'completed';
}

export interface GalleryItem {
  beforeImage: string;
  afterImage: string;
  title: string;
  description: string;
}

export interface Service {
  title: string;
  description: string;
  image: string;
  details: string;
}
