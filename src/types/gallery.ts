export interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  before_image_url?: string;
  after_image_url?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GalleryFormData {
  title: string;
  description: string;
  before_image_url: string;
  after_image_url: string;
}

export interface ImageUploadResponse {
  url: string;
  path: string;
} 