import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Sidebar from "../../../components/adminComponents/Sidebar";
import { useSelector } from "react-redux";
import { UserReducerInitialState } from "../../../types/reducerTypes";
import { useNavigate, useParams } from "react-router-dom";
import {
  useDeleteProductMutation,
  useProductDetailsQuery,
  useUpdateProductMutation,
} from "../../../redux/api/productAPI";
import { server } from "../../../redux/store";
import Loader from "../../../components/Loader";
import { reactToastRes } from "../../../utils/Features";
import { FaTrash } from "react-icons/fa";

const ProductManagement = () => {
  const { user } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer
  );

  const params = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useProductDetailsQuery(params.id!);

  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const { photo, category, name, stock, price } = data?.data.product || {
    photo: "",
    category: "",
    name: "",
    stock: 0,
    price: 0,
  };

  const [nameUpdate, setNameUpdate] = useState<string>(name);
  const [priceUpdate, setPriceUpdate] = useState<number>(price);
  const [stockUpdate, setStockUpdate] = useState<number>(stock);
  const [picUpdate, setPicUpdate] = useState<string>("");
  const [picFile, setPicFile] = useState<File>();
  const [categoryUpdate, setCategoryUpdate] = useState<string>(category);

  const picHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = e.target.files?.[0];

    const reader: FileReader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPicUpdate(reader.result);
          setPicFile(file);
        }
      };
    }
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    if (nameUpdate) formData.set("name", nameUpdate);
    if (priceUpdate) formData.set("price", priceUpdate.toString());
    if (stockUpdate !== undefined)
      formData.set("stock", stockUpdate.toString());
    if (picFile) formData.set("photo", picFile);
    if (categoryUpdate) formData.set("category", categoryUpdate);

    const res = await updateProduct({
      userId: user?._id!,
      productId: data?.data.product._id!,
      formData,
    });

    reactToastRes(res, navigate, "/admin/products");
  };

  const deleteHandler = async () => {
    const res = await deleteProduct({
      userId: user?._id!,
      productId: data?.data.product._id!,
    });

    reactToastRes(res, navigate, "/admin/products");
  };

  useEffect(() => {
    if (data) {
      setNameUpdate(data.data.product.name);
      setPriceUpdate(data.data.product.price);
      setStockUpdate(data.data.product.stock);
      setCategoryUpdate(data.data.product.category);
    }
  }, [data]);

  return (
    <div className="adminContainer">
      <Sidebar />
      <main className="productManagementContainer">
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <section>
              <strong>Id: {data?.data.product._id}</strong>
              <img src={`${server}/${photo}`} alt="Product Pic" />
              <p>{name}</p>
              {stock > 0 ? (
                <span className="green">{stock} Available</span>
              ) : (
                <span className="red">Not Available</span>
              )}
              <h3>Rs{price}</h3>
            </section>

            <article>
              <button className="productDeleteBtn" onClick={deleteHandler}>
                <FaTrash />
              </button>
              <form onSubmit={submitHandler}>
                <h2>Manage Product</h2>
                <div>
                  <label>Name</label>
                  <input
                    type="text"
                    placeholder="Name"
                    value={nameUpdate}
                    onChange={(e) => setNameUpdate(e.target.value)}
                  />
                </div>
                <div>
                  <label>Price</label>
                  <input
                    type="number"
                    placeholder="Price"
                    value={priceUpdate}
                    onChange={(e) => setPriceUpdate(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Stock</label>
                  <input
                    type="number"
                    placeholder="Stock"
                    value={stockUpdate}
                    onChange={(e) => setStockUpdate(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Category</label>
                  <input
                    type="text"
                    placeholder="Category"
                    value={categoryUpdate}
                    onChange={(e) => setCategoryUpdate(e.target.value)}
                  />
                </div>
                <div>
                  <label>Image</label>
                  <input type="file" onChange={picHandler} />
                </div>
                {picUpdate && <img src={picUpdate} alt="Product Image" />}
                <button type="submit">Update</button>
              </form>
            </article>
          </>
        )}
      </main>
    </div>
  );
};

export default ProductManagement;
