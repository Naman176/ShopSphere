export type User = {
  name: string;
  email: string;
  photo: string;
  gender: string;
  role: string;
  dob: string;
  _id: string;
};

export type Product = {
  name: string;
  category: string;
  photo: string;
  price: number;
  stock: number;
  _id: string;
};

export type ShippingInfo = {
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
};

export type CartItem = {
  productId: string;
  photo: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
};

export type OrderItem = Omit<CartItem, "stock"> & { _id: string };

export type Order = {
  shippingInfo: ShippingInfo;
  _id: string;
  user: {
    _id: string;
    name: string;
  };
  subTotal: number;
  tax: number;
  discount: number;
  shippingCharges: number;
  total: number;
  status: "Processing" | "Shipped" | "Delivered";
  orderItems: OrderItem[];
};

export type CountAndChange = {
  revenue: number;
  product: number;
  user: number;
  order: number;
};

export type LatestTransaction = {
  _id: string;
  amount: number;
  discount: number;
  quantity: number;
  status: string;
};

export type Stats = {
  categoryCount: Record<string, number>[];
  percentageChange: CountAndChange;
  count: CountAndChange;
  chart: {
    order: number[];
    revenue: number[];
  };
  userGenderratio: {
    male: number;
    female: number;
  };
  modifiedLatestTransaction: LatestTransaction[];
};

export type OrderFullfillment = {
  processing: number;
  shipped: number;
  delivered: number;
};

export type RevenueDistribution = {
  netMargin: number;
  discount: number;
  productionCost: number;
  burnt: number;
  marketingCost: number;
};

export type UsersAgeGroup = {
  teen: number;
  adult: number;
  old: number;
};

export type Pie = {
  orderFullfillment: OrderFullfillment;
  productCategory: Record<string, number>[];
  stockAvailability: {
    inStock: number;
    outOfStock: number;
  };
  revenueDistribution: RevenueDistribution;
  adminCustomer: {
    admin: number;
    customer: number;
  };
  usersAgeGroup: UsersAgeGroup;
};

export type Bar = {
  users: number[];
  products: number[];
  orders: number[];
};

export type Line = {
  users: number[];
  products: number[];
  discount: number[];
  revenue: number[];
};
