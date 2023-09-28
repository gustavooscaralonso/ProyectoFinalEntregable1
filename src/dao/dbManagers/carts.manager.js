import { cartsModel } from '../models/carts.model.js';

export default class Carts {
  constructor() {
    console.log('Carts DB');
  }

  getAll = async () => {
    const carts = await cartsModel.find();
    return carts.map(cart => cart.toObject());
  }

  getOne = async (id) => {
    const cart = await cartsModel.findOne({ _id: id });
    return cart;
  }

  save = async (cart) => {
    const result = await cartsModel.create(cart);
    return result;
  }
  update = async (id, cart) => {
    const result = await cartsModel.updateOne({ _id: id }, cart);
    return result;
  }

  delete = async (id) => {
    await cartsModel.deleteOne({ id });
  }
}