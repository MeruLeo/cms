// وضعیت محصول: موجود، ناموجود، متوقف
export enum ProductStatus {
  AVAILABLE = "available",
  OUT_OF_STOCK = "out_of_stock",
  DISCONTINUED = "discontinued",
}

export interface IProduct {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  price: number;
  status: ProductStatus;
  createdAt: Date;
  updatedAt: Date;
  category?: string;
  tags?: string[];
  images?: string[];
  stockCount: number;
}
