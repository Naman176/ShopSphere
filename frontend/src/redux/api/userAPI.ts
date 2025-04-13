import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { deleteUserRequest, ResponseType } from "../../types/apiTypes";
import { User } from "../../types/types";
import axios from "axios";

export const userAPI = createApi({
  reducerPath: "userAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/user/`,
  }),
  tagTypes: ["user"],
  endpoints: (builder) => ({
    login: builder.mutation<ResponseType, User>({
      query: (user) => ({
        url: "new",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["user"],
    }),

    deleteUser: builder.mutation<ResponseType, deleteUserRequest>({
      query: ({ userId, adminId }) => ({
        url: `${userId}?id=${adminId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["user"],
    }),

    allUsers: builder.query<ResponseType, string>({
      query: (id) => `all?id=${id}`,
      providesTags: ["user"],
    }),
  }),
});

export const getUser = async (id: string) => {
  try {
    const { data }: { data: ResponseType } = await axios.get(
      `${import.meta.env.VITE_SERVER}/api/v1/user/${id}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const { useLoginMutation, useDeleteUserMutation, useAllUsersQuery } =
  userAPI;
