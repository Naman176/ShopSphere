import { ReactElement, useEffect, useState } from "react";
import Sidebar from "../../components/adminComponents/Sidebar";
import { Column } from "react-table";
import TableHOC from "../../components/adminComponents/TableHOC";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { useAllProductsQuery } from "../../redux/api/productAPI";
import toast from "react-hot-toast";
import { CustomError } from "../../types/apiTypes";
import { useSelector } from "react-redux";
import { UserReducerInitialState } from "../../types/reducerTypes";
import { Product } from "../../types/types";
import { server } from "../../redux/store";
import Loader from "../../components/Loader";

interface DataType {
  photo: ReactElement;
  name: string;
  price: number;
  stock: number;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Photo",
    accessor: "photo",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Price",
    accessor: "price",
  },
  {
    Header: "Stock",
    accessor: "stock",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Products = () => {
  const { user } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer
  );
  const { data, isLoading, isError, error } = useAllProductsQuery(user?._id!);
  const [rows, setRows] = useState<DataType[]>([]);

  if (isError) toast.error((error as CustomError).data.message);

  useEffect(() => {
    if (data)
      setRows(
        data.data.allProducts.map((i: Product) => ({
          photo: <img src={`${server}/${i.photo}`} />,
          name: i.name,
          price: i.price,
          stock: i.stock,
          action: <Link to={`/admin/product/${i._id}`}>Manage</Link>,
        }))
      );
  }, [data]);

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "productBox",
    "Products",
    rows.length > 6
  );

  return (
    <div className="adminContainer">
      <Sidebar />
      <main>{isLoading ? <Loader /> : Table()}</main>
      <Link to="/admin/product/new" className="createProductBtn">
        <FaPlus />
      </Link>
    </div>
  );
};

export default Products;
