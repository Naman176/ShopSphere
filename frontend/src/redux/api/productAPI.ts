import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  deleteProductRequest,
  newProductRequest,
  ResponseType,
  searchAndFilterProductsRequest,
  updateProductRequest,
} from "../../types/apiTypes";

export const productAPI = createApi({
  reducerPath: "productAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/product/`,
  }),
  tagTypes: ["product"],
  endpoints: (builder) => ({
    latestProducts: builder.query<ResponseType, string>({
      query: () => "latest",
      providesTags: ["product"],
    }),

    allProducts: builder.query<ResponseType, string>({
      query: (id) => `all?id=${id}`,
      providesTags: ["product"],
    }),

    allCategories: builder.query<ResponseType, string>({
      query: () => "category",
      providesTags: ["product"],
    }),

    searchAndFilterProducts: builder.query<
      ResponseType,
      searchAndFilterProductsRequest
    >({
      query: ({ price, page, category, search, sort }) => {
        let base = `search?search=${search}&page=${page}`;
        if (price) base += `&price=${price}`;
        if (sort) base += `&sort=${sort}`;
        if (category) base += `&category=${category}`;

        return base;
      },
      providesTags: ["product"],
    }),

    productDetails: builder.query<ResponseType, string>({
      query: (id) => id,
      providesTags: ["product"],
    }),

    createProduct: builder.mutation<ResponseType, newProductRequest>({
      query: ({ id, formData }) => ({
        url: `new?id=${id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["product"],
    }),

    updateProduct: builder.mutation<ResponseType, updateProductRequest>({
      query: ({ userId, productId, formData }) => ({
        url: `${productId}?id=${userId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["product"],
    }),

    deleteProduct: builder.mutation<ResponseType, deleteProductRequest>({
      query: ({ userId, productId }) => ({
        url: `${productId}?id=${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["product"],
    }),
  }),
});

export const {
  useLatestProductsQuery,
  useAllProductsQuery,
  useAllCategoriesQuery,
  useSearchAndFilterProductsQuery,
  useProductDetailsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productAPI;
