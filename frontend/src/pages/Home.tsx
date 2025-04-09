import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useLatestProductsQuery } from "../redux/api/productAPI";
import { Product } from "../types/types";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

const Home = () => {
  const { data, isLoading, isError } = useLatestProductsQuery("");

  const addToCartHandler = () => {};

  if (isError) toast.error("Cannot Fetch Latest Products");

  return (
    <div className="home">
      {/* <section></section> */}

      <h1>
        Latest Products
        <Link to={"/search"} className="findMore">
          More
        </Link>
      </h1>

      <main>
        {isLoading ? (
          <Loader />
        ) : (
          data?.data?.latestProducts.map((i: Product) => (
            <ProductCard
              key={i._id}
              productId={i._id}
              name={i.name}
              price={i.price}
              stock={i.stock}
              handler={addToCartHandler}
              photo={i.photo}
            />
          ))
        )}
      </main>
    </div>
  );
};

export default Home;
