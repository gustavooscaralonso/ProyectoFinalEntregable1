import express from 'express';
import fs from 'fs';
import { addCart, addProduct, } from '../utils/cartOperations.js';
const router = express.Router();

router.get('/', (req, res) => {
  try {
    const carts = JSON.parse(fs.readFileSync('./carts.json'));
    res.send(carts)
  } catch (error) {
    res.status(404).json({ error: "No se encontraron carritos guardados" });
    console.log(error);
  }
})

router.get('/:cid', (req, res) => {
  let cartId = req.params.cid
  const carts = JSON.parse(fs.readFileSync('./carts.json'));

  const cart = carts.find(cart => cart.cartId == cartId)

  if (!cart) {
    res.status(404).json({ error: "El carrito no existe" });
  } else {
    res.send(cart)
  }
})

router.post('/cart', (req, res) => {
  let products = req.body
  addCart(products)
  res.send(products)
})

router.post('/:cid/product/:pid', (req, res) => {
  let cartId = parseInt(req.params.cid)
  let productId = parseInt(req.params.pid)
  let quantity = req.body[0].quantity
  addProduct(cartId, productId, quantity)
})



export default router;
