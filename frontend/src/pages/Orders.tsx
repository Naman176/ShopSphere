import { ReactElement, useEffect, useState } from "react";
import TableHOC from "../components/adminComponents/TableHOC";
import { Column } from "react-table";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMyOrdersQuery } from "../redux/api/orderAPI";
import toast from "react-hot-toast";
import { CustomError } from "../types/apiTypes";
import Loader from "../components/Loader";
import { Order } from "../types/types";
import { RootState } from "../redux/store";

type DataType = {
  _id: string;
  amount: number;
  quantity: number;
  discount: number;
  status: ReactElement;
  action: ReactElement;
};

const columns: Column<DataType>[] = [
  {
    Header: "ID",
    accessor: "_id",
  },
  {
    Header: "Quantity",
    accessor: "quantity",
  },
  {
    Header: "Discount",
    accessor: "discount",
  },
  {
    Header: "Amount",
    accessor: "amount",
  },
  {
    Header: "Status",
    accessor: "status",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Orders = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const { data, isLoading, isError, error } = useMyOrdersQuery(user?._id!);

  const [rows, setRows] = useState<DataType[]>([]);

  if (isError) toast.error((error as CustomError).data.message);

  useEffect(() => {
    if (data)
      setRows(
        data.data.orders.map((i: Order) => ({
          _id: i._id,
          amount: i.total,
          discount: i.discount,
          quantity: i.orderItems.length,
          status: (
            <span
              className={
                i.status === "Processing"
                  ? "red"
                  : i.status === "Shipped"
                  ? "green"
                  : "purple"
              }
            >
              {i.status}
            </span>
          ),
          action: <Link to={`/admin/transaction/${i._id}`}>Manage</Link>,
        }))
      );
  }, [data]);

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "productBox",
    "Orders",
    rows.length > 6
  )();

  return (
    <div className="container">
      <h1>My Orders</h1>
      {isLoading ? <Loader /> : Table}
    </div>
  );
};

export default Orders;
