import express from 'express';
import fs from 'fs';
import { addCart, addProduct, } from '../utils/cartOperations.js';
import { CartManager } from '../classes/CartManager.js';

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const carts = JSON.parse(fs.readFileSync('./carts.json'));
    res.send(carts)
  } catch (error) {
    res.status(404).json({ error: "No se encontraron carritos guardados" });
    console.log(error);
  }
});

router.get('/:cid', (req, res) => {
  const cm = new CartManager();
  let cartId = req.params.cid
  const carts = cm.getProductsByCartId()

  const cart = carts.find(cart => cart.cartId == cartId)

  if (!cart) {
    res.status(404).json({ error: "El carrito no existe" });
  } else {
    res.send(cart)
  }
})

router.post('/cart', (req, res) => {
  const cm = new CartManager();
  let products = req.body
  cm.addCart(products)
  res.send(products)
})

router.post('/:cid/product/:pid', (req, res) => {
  const cm = new CartManager();
  let cartId = parseInt(req.params.cid)
  let productId = parseInt(req.params.pid)
  let quantity = req.body[0].quantity
  addProduct(cartId, productId, quantity)
})



export default router;
