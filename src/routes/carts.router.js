import express from 'express';
import fs from 'fs';
import { addCart, addProduct, } from '../dao/fileManagers/utils/cartOperations.js';
import { CartManager } from '../dao/fileManagers/CartManager.js';

import Carts from '../dao/dbManagers/carts.manager.js';
const cartsManager = new Carts()

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const cartsDB = await cartsManager.getAll();
    const carts = JSON.parse(fs.readFileSync('./carts.json'));
    res.send(cartsDB)
    console.log(carts);
  } catch (error) {
    res.status(404).json({ error: "No se encontraron carritos guardados" });
    console.log(error);
  }
});

router.get('/:cid', async (req, res) => {
  const cm = new CartManager();
  let cartId = req.params.cid
  //const carts = cm.getProductsByCartId()
  try {
    const cart = await cartsManager.getOne(cartId)
    res.status(201).send({ status: 'success', payload: cart });
  } catch (error) {
    res.status(500).send({ status: 'error', error: error.message });
  }
  /* const cart = carts.find(cart => cart.cartId == cartId)

  if (!cart) {
    res.status(404).json({ error: "El carrito no existe" });
  } else {
    res.send(cart)
  }*/
})

router.post('/cart', async (req, res) => {
  const cm = new CartManager();
  let products = req.body;

  try {
    cm.addCart(products);
    const result = await cartsManager.save({
      products
    })
    //res.send(products)
    res.status(201).send({ status: 'success', payload: result });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ error: error.message })
  }

})

router.post('/:cid/product/:pid', (req, res) => {
  const cm = new CartManager();
  let cartId = parseInt(req.params.cid)
  let productId = parseInt(req.params.pid)
  let quantity = req.body[0].quantity
  addProduct(cartId, productId, quantity)
});



export default router;
