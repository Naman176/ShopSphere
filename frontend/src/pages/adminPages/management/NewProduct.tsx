import { ChangeEvent, useState } from "react";
import Sidebar from "../../../components/adminComponents/Sidebar";

const NewProduct = () => {
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<number>();
  const [stock, setStock] = useState<number>();
  const [pic, setPic] = useState<string>();

  const picHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = e.target.files?.[0];

    const reader: FileReader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === "string") setPic(reader.result);
      };
    }
  };

  return (
    <div className="adminContainer">
      <Sidebar />
      <main className="productManagementContainer">
        <article>
          <form>
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
              <label>Image</label>
              <input type="file" onChange={picHandler} required />
            </div>
            {pic && <img src={pic} alt="Product Image" />}
            <button type="submit">Add Product</button>
          </form>
        </article>
      </main>
    </div>
  );
};

export default NewProduct;
