import Sidebar from "../../../components/adminComponents/Sidebar";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { Order, OrderItem } from "../../../types/types";
import { useSelector } from "react-redux";
import { UserReducerInitialState } from "../../../types/reducerTypes";
import {
  useDeleteOrderMutation,
  useOrderDetailsQuery,
  useProcessOrderMutation,
} from "../../../redux/api/orderAPI";
import Loader from "../../../components/Loader";
import { FaTrash } from "react-icons/fa";
import { server } from "../../../redux/store";
import { reactToastRes } from "../../../utils/Features";

const initialData: Order = {
  shippingInfo: {
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
  },
  _id: "",
  user: {
    _id: "",
    name: "",
  },
  subTotal: 0,
  tax: 0,
  discount: 0,
  shippingCharges: 0,
  total: 0,
  status: "Processing",
  orderItems: [],
};

const TransactionManagement = () => {
  const { user } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer
  );

  const params = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useOrderDetailsQuery(params.id!);

  const {
    shippingInfo: { address, city, state, country, pinCode },
    user: { name },
    subTotal,
    tax,
    discount,
    shippingCharges,
    total,
    status,
    orderItems,
  } = data?.data.order || initialData;

  const [updateOrder] = useProcessOrderMutation();
  const [deleteOrder] = useDeleteOrderMutation();

  const updateHandler = async () => {
    const res = await updateOrder({
      userId: user?._id!,
      orderId: params.id!,
    });
    reactToastRes(res, navigate, "/admin/transaction");
  };

  const deleteHandler = async () => {
    const res = await deleteOrder({
      userId: user?._id!,
      orderId: params.id!,
    });
    reactToastRes(res, navigate, "/admin/transaction");
  };

  if (isError) return <Navigate to={"/404"} />;

  return (
    <div className="adminContainer">
      <Sidebar />
      <main className="productManagementContainer">
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <section>
              <h2>Order Items</h2>
              {orderItems.map((i: OrderItem) => (
                <ProductCard
                  productId={i.productId}
                  name={i.name}
                  photo={`${server}/${i.photo}`}
                  price={i.price}
                  quantity={i.quantity}
                  _id={i._id}
                />
              ))}
            </section>

            <article className="shippingInfoCard">
              <button className="productDeleteBtn" onClick={deleteHandler}>
                <FaTrash />
              </button>
              <h1>Order Info</h1>
              <h5>User Info</h5>
              <p>Name: {name}</p>
              <p>
                Address:{" "}
                {`${address}, ${city}, ${state}, ${country} ${pinCode}`}
              </p>

              <h5>Amount Info</h5>
              <p>Subtotal: {subTotal}</p>
              <p>Shipping Charger: {shippingCharges}</p>
              <p>Tax: {tax}</p>
              <p>Discount: {discount}</p>
              <p>Total: {total}</p>

              <h5>Status Info</h5>
              <p>
                Status:{" "}
                <span
                  className={
                    status === "Delivered"
                      ? "green"
                      : status === "Processing"
                      ? "red"
                      : "purple"
                  }
                >
                  {status}
                </span>
              </p>
              <button className="processStatusButton" onClick={updateHandler}>
                Process Status
              </button>
            </article>
          </>
        )}
      </main>
    </div>
  );
};

const ProductCard = ({ name, photo, price, quantity, _id }: OrderItem) => (
  <div className="transactionProductCard">
    <img src={photo} alt={name} />
    <Link to={`/product/${_id}`}>{name}</Link>
    <span>
      Rs{price} X {quantity} = Rs{price * quantity}
    </span>
  </div>
);

export default TransactionManagement;
