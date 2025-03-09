import { useState } from "react";
import Sidebar from "../../../components/adminComponents/Sidebar";
import { Link } from "react-router-dom";

const img =
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvZXN8ZW58MHx8MHx8&w=1000&q=804";

const orderItems: OrderItemType[] = [
  {
    name: "Puma Shoes",
    pic: img,
    _id: "asdsaasdas",
    quantity: 4,
    price: 2000,
  },
];

const TransactionManagement = () => {
  const [order, setOrder] = useState<OrderType>({
    name: "Puma Shoes",
    address: "77 black street",
    city: "Neyword",
    state: "Nevada",
    country: "US",
    pinCode: 242433,
    status: "Processing",
    subTotal: 4000,
    discount: 1200,
    shippingCharges: 0,
    tax: 200,
    totalAmount: 4000 + 200 + 0 - 1200,
    orderItems,
    _id: "jdnevjenejve",
  });

  const updateHandler = () => {
    setOrder((prev) => ({
      ...prev,
      status: prev.status === "Processing" ? "Shipped" : "Delivered",
    }));
  };

  return (
    <div className="adminContainer">
      <Sidebar />
      <main className="productManagementContainer">
        <section>
          <h2>Order Items</h2>
          {order.orderItems.map((i) => (
            <ProductCard
              name={i.name}
              pic={i.pic}
              price={i.price}
              quantity={i.quantity}
              _id={i._id}
            />
          ))}
        </section>

        <article className="shippingInfoCard">
          <h1>Order Info</h1>
          <h5>User Info</h5>
          <p>Name: {order.name}</p>
          <p>
            Address:{" "}
            {`${order.address}, ${order.city}, ${order.country} ${order.pinCode}`}
          </p>

          <h5>Amount Info</h5>
          <p>Subtotal: {order.subTotal}</p>
          <p>Shipping Charger: {order.shippingCharges}</p>
          <p>Tax: {order.tax}</p>
          <p>Discount: {order.discount}</p>
          <p>Total: {order.totalAmount}</p>

          <h5>Status Info</h5>
          <p>
            Status:{" "}
            <span
              className={
                order.status === "Delivered"
                  ? "green"
                  : order.status === "Processing"
                  ? "red"
                  : "purple"
              }
            >
              {order.status}
            </span>
          </p>
          <button onClick={updateHandler}>Process Status</button>
        </article>
      </main>
    </div>
  );
};

const ProductCard = ({ name, pic, price, quantity, _id }: OrderItemType) => (
  <div className="transactionProductCard">
    <img src={pic} alt={name} />
    <Link to={`/product/${_id}`}>{name}</Link>
    <span>
      Rs{price} X {quantity} = Rs{price * quantity}
    </span>
  </div>
);

export default TransactionManagement;
