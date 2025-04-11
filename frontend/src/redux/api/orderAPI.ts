import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  newOrderRequest,
  processOrderRequest,
  ResponseType,
} from "../../types/apiTypes";

export const orderAPI = createApi({
  reducerPath: "orderAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/order/`,
  }),
  tagTypes: ["order"],
  endpoints: (builder) => ({
    newOrder: builder.mutation<ResponseType, newOrderRequest>({
      query: (order) => ({
        url: "new",
        method: "POST",
        body: order,
      }),
      invalidatesTags: ["order"],
    }),

    processOrder: builder.mutation<ResponseType, processOrderRequest>({
      query: ({ userId, orderId }) => ({
        url: `${orderId}?id=${userId}`,
        method: "PUT",
      }),
      invalidatesTags: ["order"],
    }),

    deleteOrder: builder.mutation<ResponseType, processOrderRequest>({
      query: ({ userId, orderId }) => ({
        url: `${orderId}?id=${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["order"],
    }),

    myOrders: builder.query<ResponseType, string>({
      query: (id) => `my?id=${id}`,
      providesTags: ["order"],
    }),

    allOrders: builder.query<ResponseType, string>({
      query: (id) => `all?id=${id}`,
      providesTags: ["order"],
    }),

    orderDetails: builder.query<ResponseType, string>({
      query: (id) => id,
      providesTags: ["order"],
    }),
  }),
});

export const {
  useNewOrderMutation,
  useProcessOrderMutation,
  useDeleteOrderMutation,
  useMyOrdersQuery,
  useAllOrdersQuery,
  useOrderDetailsQuery,
} = orderAPI;
