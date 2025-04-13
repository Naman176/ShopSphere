import { ChangeEvent, FormEvent, useState } from "react";
import Sidebar from "../../../components/adminComponents/Sidebar";
import { useSelector } from "react-redux";
import { useCreateProductMutation } from "../../../redux/api/productAPI";
import { reactToastRes } from "../../../utils/features";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../../redux/store";

const NewProduct = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const navigate = useNavigate();

  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<number>();
  const [stock, setStock] = useState<number>();
  const [pic, setPic] = useState<File>();
  const [picPrev, setPicPrev] = useState<string>();
  const [category, setCategory] = useState<string>();

  const [newProduct] = useCreateProductMutation();

  const picHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = e.target.files?.[0];

    const reader: FileReader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPicPrev(reader.result);
          setPic(file);
        }
      };
    }
  };

  const createProductHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !price || !stock || !pic || !category) return;

    const formData = new FormData();
    formData.set("name", name);
    formData.set("price", price?.toString());
    formData.set("stock", stock?.toString());
    formData.set("photo", pic);
    formData.set("category", category);

    const res = await newProduct({ id: user?._id!, formData });
    reactToastRes(res, navigate, "/admin/products");
  };

  return (
    <div className="adminContainer">
      <Sidebar />
      <main className="productManagementContainer">
        <article>
          <form onSubmit={createProductHandler}>
            <h2>New Product</h2>
            <div>
              <label>Name</label>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Price</label>
              <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                required
              />
            </div>
            <div>
              <label>Stock</label>
              <input
                type="number"
                placeholder="Stock"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                required
              />
            </div>
            <div>
              <label>Category</label>
              <input
                type="text"
                placeholder="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Image</label>
              <input type="file" onChange={picHandler} required />
            </div>
            {picPrev && <img src={picPrev} alt="Product Image" />}
            <button type="submit">Add Product</button>
          </form>
        </article>
      </main>
    </div>
  );
};

export default NewProduct;
