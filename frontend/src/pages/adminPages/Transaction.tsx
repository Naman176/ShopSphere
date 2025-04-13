import { ReactElement, useEffect, useState } from "react";
import { Column } from "react-table";
import Sidebar from "../../components/adminComponents/Sidebar";
import { Link } from "react-router-dom";
import TableHOC from "../../components/adminComponents/TableHOC";
import { useSelector } from "react-redux";
import { useAllOrdersQuery } from "../../redux/api/orderAPI";
import toast from "react-hot-toast";
import { CustomError } from "../../types/apiTypes";
import { Order } from "../../types/types";
import Loader from "../../components/Loader";
import { RootState } from "../../redux/store";

interface DataType {
  user: string;
  amount: number;
  discount: number;
  quantity: number;
  status: ReactElement;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "User",
    accessor: "user",
  },
  {
    Header: "Amount",
    accessor: "amount",
  },
  {
    Header: "Discount",
    accessor: "discount",
  },
  {
    Header: "Quantity",
    accessor: "quantity",
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

const Transaction = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const { data, isLoading, isError, error } = useAllOrdersQuery(user?._id!);
  const [rows, setRows] = useState<DataType[]>([]);

  if (isError) toast.error((error as CustomError).data.message);

  useEffect(() => {
    if (data)
      setRows(
        data.data.orders.map((i: Order) => ({
          user: i.user.name,
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
    "Transactions",
    rows.length > 6
  );

  return (
    <div className="adminContainer">
      <Sidebar />
      <main>{isLoading ? <Loader /> : Table()}</main>
    </div>
  );
};

export default Transaction;
