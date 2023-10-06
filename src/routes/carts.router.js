import express from 'express';
import fs from 'fs';
import { addCart, addProduct, } from '../dao/fileManagers/utils/cartOperations.js';
import { CartManager } from '../dao/fileManagers/CartManager.js';
import Carts from '../dao/dbManagers/carts.manager.js';
import { cartsModel } from '../dao/models/carts.model.js';

const cartsManager = new Carts()

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const cartsDB = await cartsManager.getAll();

    //const carts = JSON.parse(fs.readFileSync('./carts.json'));
    //res.send(cartsDB);
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
    res.send(products)
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

router.put('/:cid/products/:pid', async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const newQuantity = req.body.quantity;

  const cart = await cartsManager.getOne(cartId)
  console.log(cart);

  const productToUpdate = cart.products.find(product => product.id === productId);
  productToUpdate.quantity = newQuantity;

  await cart.save();

  return res.status(200).json({ message: 'Cantidad de producto actualizada con éxito.' });
})

router.delete('/:cid', async (req, res) => {
  try {
    const cartId = req.params.cid;

    // Buscar el carrito por su ID y actualizar el arreglo de productos a un arreglo vacío
    const updatedCart = await cartsModel.findOneAndUpdate(
      { _id: cartId },
      { $set: { products: [] } },
      { new: true }
    );

    if (!updatedCart) {
      return res.status(404).json({ message: 'Carrito no encontrado.' });
    }

    return res.status(200).json({ message: 'Todos los productos del carrito han sido borrados con éxito.' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
})

router.delete('/:cid/products/:pid', async (req, res) => {
  let cartId = req.params.cid
  let productIdToDelete = req.params.pid

  try {
    // Buscar el carrito por su ID
    const cart = await cartsManager.getOne(cartId)


    if (!cart) {
      console.log('Carrito no encontrado.');
      return;
    }

    // Encontrar el índice del producto que deseas borrar en el arreglo de productos del carrito
    const productIndexToDelete = cart.products.findIndex(product => product.id === productIdToDelete);

    // Si se encontró el producto en el carrito, borrarlo
    if (productIndexToDelete !== -1) {
      cart.products.splice(productIndexToDelete, 1); // Borrar el producto del arreglo
      await cart.save(); // Guardar el carrito actualizado
      console.log('Producto borrado del carrito con éxito.');
    } else {
      console.log('El producto no se encontró en el carrito.');
    }
  } catch (error) {
    console.error('Error:', error);
  }

});

export default router;
