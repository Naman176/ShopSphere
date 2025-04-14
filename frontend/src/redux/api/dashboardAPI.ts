import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ResponseType } from "../../types/apiTypes";

export const dashboardAPI = createApi({
  reducerPath: "dashboardAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/dashboard/`,
  }),
  endpoints: (builder) => ({
    stats: builder.query<ResponseType, string>({
      query: (id) => `/stats?id=${id}`,
      keepUnusedDataFor: 0,
    }),

    pie: builder.query<ResponseType, string>({
      query: (id) => `/pie?id=${id}`,
      keepUnusedDataFor: 0,
    }),

    bar: builder.query<ResponseType, string>({
      query: (id) => `/bar?id=${id}`,
      keepUnusedDataFor: 0,
    }),

    line: builder.query<ResponseType, string>({
      query: (id) => `/line?id=${id}`,
      keepUnusedDataFor: 0,
    }),
  }),
});

export const { useStatsQuery, usePieQuery, useBarQuery, useLineQuery } =
  dashboardAPI;
