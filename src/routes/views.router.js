import express from "express";
const router = express.Router();
import fs from 'fs'
import ProductManager from '../dao/fileManagers/ProductManager.js';
let pm = new ProductManager();

const products = JSON.parse(fs.readFileSync('product.json'));

router.get('/', (req, res) => {
  res.render('index',
    {
      style: 'index.css',
      product: products
    }
  )
});

router.get('/realtimeproducts', (req, res) => {
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
