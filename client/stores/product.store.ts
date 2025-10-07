"use client";

import { create } from "zustand";
import { productService } from "@/services/product.service";
import { IProduct } from "@/types/product.type";

interface ProductState {
  products: IProduct[];
  selectedProduct: IProduct | null;
  total: number;
  pages: number;
  loading: boolean;
  error: string | null;

  // actions
  setProducts: (products: IProduct[]) => void;
  setSelectedProduct: (product: IProduct | null) => void;

  fetchAllProducts: (params?: any) => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;
  createOrUpdateProduct: (data: Partial<IProduct>) => Promise<void>;
  updateProduct: (id: string, data: Partial<IProduct>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  selectedProduct: null,
  total: 0,
  pages: 0,
  loading: false,
  error: null,

  setProducts: (products) => set({ products }),
  setSelectedProduct: (product) => set({ selectedProduct: product }),

  fetchAllProducts: async (params) => {
    set({ loading: true, error: null });
    try {
      const res = await productService.getAllProducts(params);
      set({
        products: res.data.items,
        total: res.data.total,
        pages: res.data.pages,
        loading: false,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to fetch products",
        loading: false,
      });
    }
  },

  fetchProductById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await productService.getProductById(id);
      set({ selectedProduct: res.data.product, loading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to fetch product",
        loading: false,
      });
    }
  },

  createOrUpdateProduct: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await productService.createOrUpdateProduct(data);
      set((state) => {
        const updated = state.products.filter(
          (p) => p._id !== res.data.product._id
        );
        return { products: [res.data.product, ...updated], loading: false };
      });
    } catch (err: any) {
      set({
        error:
          err.response?.data?.message || "Failed to create or update product",
        loading: false,
      });
    }
  },

  updateProduct: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const res = await productService.updateProduct(id, data);
      set((state) => ({
        products: state.products.map((p) =>
          p._id === id ? res.data.product : p
        ),
        loading: false,
      }));
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to update product",
        loading: false,
      });
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      await productService.deleteProduct(id);
      set((state) => ({
        products: state.products.filter((p) => p._id !== id),
        loading: false,
      }));
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to delete product",
        loading: false,
      });
    }
  },
}));
