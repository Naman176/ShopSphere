import { CartItem, ShippingInfo } from "./types";

export type ResponseType = {
  success: string;
  status: string;
  message: string;
  data: any;
};

export type CustomError = {
  status: number;
  data: {
    message: string;
    success: boolean;
  };
};

export type searchAndFilterProductsRequest = {
  price: number;
  page: number;
  category: string;
  search: string;
  sort: string;
};

export type newProductRequest = {
  id: string;
  formData: FormData;
};

export type updateProductRequest = {
  userId: string;
  productId: string;
  formData: FormData;
};

export type deleteProductRequest = {
  userId: string;
  productId: string;
};

export type newOrderRequest = {
  orderItems: CartItem[];
  subTotal: number;
  tax: number;
  discount: number;
  shippingCharges: number;
  total: number;
  shippingInfo: ShippingInfo;
  user: string;
};

export type processOrderRequest = {
  userId: string;
  orderId: string;
};
