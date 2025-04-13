interface Product {
  product_id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  condition: string;
  location: string;
  status: string;
  created_at: string;
  seller_name: string;
  images: { image_url: string }[];
  is_liked: boolean;
  likes_count: number;
}

interface Items {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  status: string;
  created_at: string;
  updated_at: string;
  seller: string;
  images: string[];
  condition: string;
}
