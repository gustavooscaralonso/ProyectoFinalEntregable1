import express from "express";
const router = express.Router();
import fs from 'fs'
import ProductManager from '../ProductManager.js';
let pm = new ProductManager();

const products = JSON.parse(fs.readFileSync('product.json'));

router.get('/', (req, res) => {
  res.render('index',
    {
      style: 'index.css',
      product: products
    }
  )
})

router.get('/realtimeproducts', (req, res) => {
  res.render('realtimeproducts',
    {
      style: 'index.css',
      product: products
    })
})
router.post('/realtimeproducts', (req, res) => {
  const { title, description, price, state = true, category, thumbnail, code, stock } = req.body;

  if (title === undefined || description === undefined || price === undefined || state === undefined || category === undefined || thumbnail === undefined || code === undefined || stock === undefined) {
    res.status(404).json({ message: 'Complete todos los campos' });
    return;
  }

  try {
    pm.addProduct(title, description, price, state, category, thumbnail, code, stock)
    res.status(200).json({ message: 'Producto agregado correctamente' });

  } catch (error) {
    res.status(500).json({ error: 'Error al generar el producto' });
  }
})


export default router;
