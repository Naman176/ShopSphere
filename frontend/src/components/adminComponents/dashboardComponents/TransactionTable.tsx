import TableHOC from "../TableHOC";
import { Column } from "react-table";

interface DataType {
  _id: string;
  quantity: number;
  amount: number;
  discount: number;
  status: string;
}

const columns: Column<DataType>[] = [
  {
    Header: "Id",
    accessor: "_id",
  },
  {
    Header: "Quantity",
    accessor: "quantity",
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
    Header: "Status",
    accessor: "status",
  },
];

const TransactionTable = ({ data = [] }: { data: DataType[] }) => {
  return TableHOC<DataType>(
    columns,
    data,
    "transactionBox",
    "Top Transaction",
  )();
};

export default TransactionTable;
