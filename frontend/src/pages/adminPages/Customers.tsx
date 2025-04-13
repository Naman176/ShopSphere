import { ReactElement, useEffect, useState } from "react";
import { Column } from "react-table";
import Sidebar from "../../components/adminComponents/Sidebar";
import TableHOC from "../../components/adminComponents/TableHOC";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  useAllUsersQuery,
  useDeleteUserMutation,
} from "../../redux/api/userAPI";
import toast from "react-hot-toast";
import { CustomError } from "../../types/apiTypes";
import { User } from "../../types/types";
import Loader from "../../components/Loader";
import { FaTrash } from "react-icons/fa";
import { reactToastRes } from "../../utils/features";

interface DataType {
  avatar: ReactElement;
  name: string;
  email: string;
  gender: string;
  role: string;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Avatar",
    accessor: "avatar",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "Gender",
    accessor: "gender",
  },
  {
    Header: "Role",
    accessor: "role",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Customers = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const { data, isLoading, isError, error } = useAllUsersQuery(user?._id!);
  const [rows, setRows] = useState<DataType[]>([]);

  const [deleteUser] = useDeleteUserMutation();

  if (isError) toast.error((error as CustomError).data.message);

  const deleteHandler = async (userId: string) => {
    const res = await deleteUser({ userId, adminId: user?._id! });
    reactToastRes(res, null, "");
  };

  useEffect(() => {
    if (data)
      setRows(
        data.data.users.map((i: User) => ({
          avatar: (
            <img style={{ borderRadius: "50%" }} src={i.photo} alt={i.name} />
          ),
          name: i.name,
          email: i.email,
          gender: i.gender,
          role: i.role,
          action: (
            <button onClick={() => deleteHandler(i._id)}>
              <FaTrash />
            </button>
          ),
        }))
      );
  }, [data]);

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "productBox",
    "Customers",
    rows.length > 6
  );

  return (
    <div className="adminContainer">
      <Sidebar />
      <main>{isLoading ? <Loader /> : Table()}</main>
    </div>
  );
};

export default Customers;
