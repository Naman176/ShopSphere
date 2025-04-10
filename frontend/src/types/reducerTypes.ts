import { CartItem, ShippingInfo, User } from "./types";

export interface UserReducerInitialState {
  user: User | null;
  loading: boolean;
}

export interface CartReducerInitialState {
  cartItems: CartItem[];
  subTotal: number;
  tax: number;
  discount: number;
  shippingCharges: number;
  total: number;
  shippingInfo: ShippingInfo;
  loading: boolean;
}
