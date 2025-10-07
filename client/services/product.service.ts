import apiClient from "@/lib/axios";
import { IProduct } from "@/types/product.type";

export interface ProductsListResponse {
  items: IProduct[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface ProductResponse {
  ok: boolean;
  product: IProduct;
}

export const productService = {
  getAllProducts: (params?: {
    title?: string;
    slug?: string;
    category?: string;
    status?: "available" | "out_of_stock" | "discontinued";
    priceMin?: number;
    priceMax?: number;
    inStock?: boolean;
    tags?: string[];
    page?: number;
    limit?: number;
    sort?: string;
  }) => apiClient.get<ProductsListResponse>("/products", { params }),

  getProductById: (id: string) =>
    apiClient.get<ProductResponse>(`/products/${id}`),

  createOrUpdateProduct: (data: Partial<IProduct>) =>
    apiClient.post<{ ok: boolean; product: IProduct; isNew: boolean }>(
      "/products",
      data
    ),

  updateProduct: (id: string, data: Partial<IProduct>) =>
    apiClient.put<ProductResponse>(`/products/${id}`, data),

  deleteProduct: (id: string) =>
    apiClient.delete<{ ok: boolean; message: string }>(`/products/${id}`),
};
