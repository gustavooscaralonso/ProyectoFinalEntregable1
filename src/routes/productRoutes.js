import express from 'express';
const router = express.Router();
import fs from 'fs';

import ProductManager from '../ProductManager.js';
let pm = new ProductManager();

router.get('/', async (req, res) => {
    let limit = req.query.limit;
    if (!limit) {
        try {
            const products = await pm.getProducts()
            console.log(products);
            res.json(products);
        } catch (error) {
            res.status(500).json({ error: 'Error al leer el archivo' });
        }
    } else {
        const products = await pm.getProducts()
        let limitedProducts = products.slice(0, 5)
        console.log(limitedProducts);
        res.status(200).json(limitedProducts);
        res.send(limitedProducts)
    }
})

router.get('/:id', async (req, res) => {
    let productId = req.params.id

    try {
        const product = await pm.getProductById(productId)
        res.json(product)
    } catch (error) {
        res.status(500).json({ error: 'El producto no existe' });
    }
})

router.post('/', async (req, res) => {
    const { title, description, price, state = true, category, thumbnail, code, stock } = req.body;

    const priceInt = parseInt(price)
    const stockInt = parseInt(stock)

    if (!title || !description || !price || !state || !category || !thumbnail || !code || !stock) {
        res.status(404).json({ message: 'Complete todos los campos' });
        return;
    }

    try {
        const products = JSON.parse(fs.readFileSync('product.json'));
        const existingProduct = products.some(element => {
            return element.code === code
        })
        if (existingProduct) {
            console.log(`Código ${code} ya existente`);
            res.status(500).json({ error: `Código ${code} ya existente` });
            return;
        }
        pm.addProduct(title, description, priceInt, state, category, thumbnail, code, stockInt)
        res.status(200).json({ message: 'Producto agregado correctamente' });

    } catch (error) {
        res.status(500).json({ error: 'Error al generar el producto' });
    }
})

router.put('/product/:pid', async (req, res) => {
    let productId = parseInt(req.params.pid)
    const updatedFields = req.body

    const products = JSON.parse(fs.readFileSync('./product.json'));

    const productIndex = products.findIndex(product => product.id === productId);
    if (productIndex !== -1) {
        products[productIndex] = {
            ...products[productIndex],
            ...updatedFields
        };
        fs.writeFileSync('./product.json', JSON.stringify(products), 'utf8');
        console.log("Producto actualizado:", products[productIndex]);
    } else {
        console.log("Producto no encontrado");
    }
})

router.delete('/product/:pid', (req, res) => {
    let productId = req.params.pid

    pm.deleteProduct(productId)
    console.log('Eliminado correctamente');
    res.status(200).json({ message: 'Eliminado correctamente' });
})

export default router;