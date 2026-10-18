export interface ProductDetailsFields {
  brand_id?: string;
  category_id?: string;
  country_id?: string;
  discount_price?: string;
  featured?: boolean;
  long_descp?: string;
  product_code?: string;
  product_color?: string;
  product_name?: string;
  product_qty?: string;
  product_size?: string;
  product_tags?: string;
  selling_price?: string;
  short_descp?: string;
  special_offer?: boolean;
  subcategory_id?: string;
  vendor_id?: string;
}

export interface ProductSelections {
  brand_id?: string;
  category_id?: string;
  country_id?: string;
  subcategory_id?: string;
  vendor_id?: string;
}

export interface ProductDetails {
  description_text?: string;
  fields?: ProductDetailsFields;
  images?: string[];
  selections?: ProductSelections;
}

export interface Product {
  detail_url: string;
  discount: string;
  image_url: string;
  listing_id: string;
  name: string;
  price: string;
  product_code: string;
  quantity: string;
  status: 'Active' | 'InActive' | string;
  details?: ProductDetails;
  image_files?: string[];
  image_mapping?: Record<string, string>;
  // Custom user overrides (stored locally)
  userNotes?: string;
  customPrice?: number;
  customQuantity?: number;
  customStatus?: string;
}

export interface CatalogMetadata {
  source: string;
  collected_at_utc: string;
  product_count: number;
  unique_image_files: number;
  detail_page_failures: number;
  missing_image_files: number;
}

export interface ProductsDataset {
  metadata: CatalogMetadata;
  products: Product[];
}

export interface FilterState {
  searchQuery: string;
  category: string;
  subcategory: string;
  brand: string;
  country: string;
  stockStatus: 'all' | 'in_stock' | 'out_of_stock' | 'low_stock';
  status: 'all' | 'Active' | 'InActive';
  minPrice: number | null;
  maxPrice: number | null;
  sortBy: 'featured' | 'price_asc' | 'price_desc' | 'name_asc' | 'stock_desc' | 'code_asc';
  viewMode: 'grid' | 'table';
}

export interface InquiryItem {
  product: Product;
  orderQuantity: number;
  notes?: string;
  addedAt: string;
}
