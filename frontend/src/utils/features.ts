import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { ResponseType } from "../types/apiTypes";
import { SerializedError } from "@reduxjs/toolkit";
import { NavigateFunction } from "react-router-dom";
import toast from "react-hot-toast";

type ResType =
  | {
      data: ResponseType;
    }
  | {
      error: FetchBaseQueryError | SerializedError;
    };

export const reactToastRes = (
  res: ResType,
  navigate: NavigateFunction | null,
  url: string
) => {
  if ("data" in res) {
    toast.success(res.data.message);
    if (navigate) {
      navigate(url);
    }
  } else {
    const error = res.error as FetchBaseQueryError;
    const messageRes = error.data as ResponseType;
    toast.error(messageRes.message);
  }
};
