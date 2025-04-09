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
