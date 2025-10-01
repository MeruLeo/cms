export enum OrderStatus {
  PENDING = "pending", // ثبت شده، در انتظار پردازش
  PROCESSING = "processing", // در حال آماده‌سازی
  SHIPPED = "shipped", // ارسال شده
  DELIVERED = "delivered", // تحویل داده شده
  CANCELED = "canceled", // لغو شده
}

export interface IOrder {
  _id: string;
  user: string;
  items: {
    product: string;
    quantity: number;
    price: number;
  }[];
  code: string;
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
