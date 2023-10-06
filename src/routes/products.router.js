import express from 'express';
const router = express.Router();
import fs from 'fs';
import { io } from '../app.js';
import ProductManager from '../dao/fileManagers/ProductManager.js';
import Products from '../dao/dbManagers/products.manager.js';
import { productsModel } from '../dao/models/products.model.js';

let pm = new ProductManager();
const productsManager = new Products();


/* router.get('/', async (req, res) => {
    const productsDB = await productsManager.getAll();

    let limit = req.query.limit || 11;
    if (!limit) {
        try {
            const productsDB = await productsManager.getAll();
            res.send(productsDB)
            const products = await pm.getProducts()
            console.log(products);
        } catch (error) {
            res.status(500).json({ error: 'Error al leer el archivo' });
        }
    } else {
        const productsDB = await productsManager.paginate({}, { limit: 10, page: 1 });
        console.log(JSON.stringify(productsDB, null, '\t'));

        res.send(productsDB)
        const products = await pm.getProducts()
        let limitedProducts = products.slice(0, 5)
        console.log(limitedProducts);
        res.status(200).json(limitedProducts);
        res.send(limitedProducts)
    }
})
 */
router.get('/:id', async (req, res) => {
    let productId = req.params.id

    try {
        const productDB = await productsManager.getOne(productId);
        res.send(productDB);

        //const product = await pm.getProductById(productId)
        //res.json(product)
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

    const products = JSON.parse(fs.readFileSync('product.json'));

    try {
        const existingProduct = products.some(element => {
            return element.code === code
        })
        if (existingProduct) {
            io.emit('add-product-error', `Código ${code} ya existente!!`)
            res.status(500).json({ error: `Código ${code} ya existente!!` });
            return;
        }
        pm.addProduct(title, description, priceInt, state, category, thumbnail, code, stockInt)
        const newProduct = { title, description, priceInt, state, category, thumbnail, code, stockInt }

        const result = productsManager.save({
            title,
            description,
            price,
            state,
            category,
            thumbnail,
            code,
            stock
        });

        res.status(201).send({ status: 'success', payload: result });
        io.emit('add-product', newProduct)

    } catch (error) {
        res.status(500).json({ error: 'Error al generar el producto' });
        return;
    }
})

router.put('/product/:pid', async (req, res) => {
    let productId = req.params.pid
    const updatedFields = req.body

    try {
        const result = await productsManager.update(productId, updatedFields)
        res.status(201).send({ status: 'success', payload: result });

    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto' });
        return;
    }
    /* const products = JSON.parse(fs.readFileSync('./product.json'));

    const productIndex = products.findIndex(product => product.id === productId);
    if (productIndex !== -1) {
        products[productIndex] = {
            ...products[productIndex],
            ...updatedFields
        };
        fs.writeFileSync('./product.json', JSON.stringify(products), 'utf8');
        const result = await productsManager.update(productId, updatedFields)

        //res.status(200).json({ message: 'Producto actualizado' });

        const updatedProduct = products[productIndex];
        io.emit('update-product', updatedProduct)
    } else {
        console.log("Producto no encontrado");
    } */
})

router.delete('/product/:pid', async (req, res) => {
    let productId = req.params.pid
    //pm.deleteProduct(productId)
    const result = await productsManager.delete(productId)
    res.send('Eliminado correctamente');
    //res.status(200).json({ message: 'Eliminado correctamente' });
})

export default router;