import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const Home = () => {
  const addToCartHandler = () => {};

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
        <ProductCard
          productId="viewveijv"
          name="Macbook"
          price={84000}
          stock={20}
          handler={addToCartHandler}
          photo="https://m.media-amazon.com/images/I/71jG+e7roXL._SL1500_.jpg"
        />
      </main>
    </div>
  );
};

export default Home;
