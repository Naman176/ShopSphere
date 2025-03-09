/// <reference types="vite/client" />

type OrderItemType = {
  name: string;
  pic: string;
  price: number;
  quantity: number;
  _id: string;
};

type OrderType = {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: number;
  status: "Processing" | "Shipped" | "Delivered";
  subTotal: number;
  discount: number;
  shippingCharges: number;
  tax: number;
  totalAmount: number;
  orderItems: OrderItemType[];
  _id: string;
};
