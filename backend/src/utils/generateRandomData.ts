import { faker } from "@faker-js/faker";
import { Product } from "../models/product.js";

export const generateProducts = async (count: number = 10) => {
  let products = [];

  for (let i = 0; i < count; i++) {
    const product = {
      name: faker.commerce.productName(),
      photo: "uploads\\0eece2e4-1c64-49a5-8f4d-f0f5c6f5af79.jpg",
      price: faker.commerce.price({ min: 1500, max: 100000, dec: 0 }),
      stock: faker.commerce.price({ min: 0, max: 50, dec: 0 }),
      category: faker.commerce.department(),
      createdAt: new Date(faker.date.past()),
      updatedAt: new Date(faker.date.recent()),
      __v: 0,
    };

    products.push(product);
  }

  await Product.create(products);
  console.log({ success: true });
};

export const deleteRandomProducts = async (count: number = 10) => {
  const products = await Product.find({}).skip(2);

  for (let i = 0; i < count; i++) {
    const product = products[i];
    await product.deleteOne();
  }

  console.log({ success: true });
};
