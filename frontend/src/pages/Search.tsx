import { useState } from "react";
import ProductCard from "../components/ProductCard";
import {
  useAllCategoriesQuery,
  useSearchAndFilterProductsQuery,
} from "../redux/api/productAPI";
import toast from "react-hot-toast";
import { CustomError } from "../types/apiTypes";
import { Product } from "../types/types";
import Loader from "../components/Loader";

const Search = () => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState(500000);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  const isPrevPage = page > 1;
  const isNextPage = page < 4;

  const {
    data: categoryData,
    isLoading: categoryIsLoading,
    isError: categoryIsError,
    error: categoryError,
  } = useAllCategoriesQuery("");

  const {
    data: searchedData,
    isLoading: searchIsLoading,
    isError: searchIsError,
    error: SearchError,
  } = useSearchAndFilterProductsQuery({
    search,
    sort,
    category,
    page,
    price: maxPrice,
  });

  if (categoryIsError) {
    toast.error((categoryError as CustomError).data.message);
  }

  if (searchIsError) {
    toast.error((SearchError as CustomError).data.message);
  }

  const addToCartHandler = () => {};

  return (
    <div className="productSearchPage">
      <aside>
        <h2>Filters</h2>
        <div>
          <h4>Sort</h4>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">None</option>
            <option value="asc">Price (Low to High)</option>
            <option value="desc">Price (High to Low)</option>
          </select>
        </div>

        <div>
          <h4>Max Price: {maxPrice || ""}</h4>
          <input
            type="range"
            min={100}
            max={500000}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>

        <div>
          <h4>Category</h4>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All</option>
            {!categoryIsLoading &&
              categoryData?.data.categories.map((i: string) => (
                <option key={i} value={i}>
                  {i.toUpperCase()}
                </option>
              ))}
          </select>
        </div>
      </aside>

      <main>
        <h1>Products</h1>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {searchIsLoading ? (
          <Loader />
        ) : (
          <div className="searchProductList">
            {searchedData?.data.searchedProducts.map((i: Product) => (
              <ProductCard
                key={i._id}
                productId={i._id}
                name={i.name}
                price={i.price}
                stock={i.stock}
                handler={addToCartHandler}
                photo={i.photo}
              />
            ))}
          </div>
        )}

        {searchedData && searchedData.data.totalPages > 1 && (
          <article>
            <button
              disabled={!isPrevPage}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Prev
            </button>
            <span>
              {page} of {searchedData.data.totalPages}
            </span>
            <button
              disabled={!isNextPage}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </button>
          </article>
        )}
      </main>
    </div>
  );
};

export default Search;
