import express from "express";
const router = express.Router();
import fs from 'fs'
import ProductManager from '../dao/fileManagers/ProductManager.js';
import { productsModel } from "../dao/models/products.model.js";


//const products = JSON.parse(fs.readFileSync('product.json'));


router.get('/', async (req, res) => {
  const productsList = await productsModel.find();
  const products = productsList.map(product => product.toObject());

  res.render('index',
    {
      style: 'index.css',
      product: products
    }
  )
});

router.get('/realtimeproducts', async (req, res) => {
  const productsList = await productsModel.find();
  const products = productsList.map(product => product.toObject());
  res.render('realtimeproducts',
    {
      style: 'index.css',
      product: products
    });
});

router.get('/chat', (req, res) => {
  res.render('chat', {})
});


export default router;
