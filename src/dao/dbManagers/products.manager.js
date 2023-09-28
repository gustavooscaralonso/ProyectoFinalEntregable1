import { productsModel } from "../models/products.model.js";

export default class Products {
  constructor() {
    console.log('Products DB');
  }

  getAll = async () => {
    const products = await productsModel.find();
    return products.map(product => product.toObject());
  }

  getOne = async (id) => {
    const product = await productsModel.findOne({ _id: id });
    return product;
  }

  save = async (product) => {
    const result = await productsModel.create(product);
    return result;
  }

  update = async (id, product) => {
    const result = await productsModel.updateOne({ _id: id }, product);
    return result;
  }

  delete = async (id) => {
    await productsModel.deleteOne({ _id: id });
  }
}

