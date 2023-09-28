import mongoose from "mongoose";

const cartsCollection = 'carts';

const cartsSchema = new mongoose.Schema({
  products: []
});

export const cartsModel = mongoose.model(cartsCollection, cartsSchema)