import express from "express";
const router = express.Router();
import fs from 'fs'
import ProductManager from '../dao/fileManagers/ProductManager.js';
import { productsModel } from "../dao/models/products.model.js";


//const products = JSON.parse(fs.readFileSync('product.json'));


/* router.get('/', async (req, res) => {
  let limit = parseInt(req.query.limit);
  let page = parseInt(req.query.page);
  let sort = parseInt(req.query.page);
  if (!limit) limit = 10;
  if (!page) page = 1;
  if (!sort) sort = 1;

  let result = await productsModel.paginate({}, { page, limit, lean: true })

  //let result = await productsModel.paginate({}, { page, limit, lean: true })
  result.prevLink = result.hasPrevPage ? `http://localhost:8080?limit=${limit}&page=${result.prevPage}` : '';
  result.nextLink = result.hasNextPage ? `http://localhost:8080?limit=${limit}&page=${result.nextPage}` : '';
  result.isValid = !(page <= 0 || page > result.totalPages)


  res.render('index',
    {
      style: 'index.css',
      result
    }
  )
}); */

router.get('/', async (req, res) => {
  let limit = parseInt(req.query.limit) || 10;
  let page = parseInt(req.query.page) || 1;
  let sort = parseInt(req.query.sort);

  const options = {
    page,
    limit,
    sort: { price: sort },
    lean: true,
  };

  try {
    const result = await productsModel.paginate({}, options);
    result.prevLink = result.hasPrevPage ? `/?limit=${limit}&page=${result.prevPage}&sort=${sort}` : '';
    result.nextLink = result.hasNextPage ? `/?limit=${limit}&page=${result.nextPage}&sort=${sort}` : '';
    result.isValid = !(page <= 0 || page > result.totalPages);

    res.render('index', {
      style: 'index.css',
      result
    });
  } catch (err) {
    console.error('Error al realizar la consulta paginada:', err);
    res.status(500).send('Error interno del servidor');
  }
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
