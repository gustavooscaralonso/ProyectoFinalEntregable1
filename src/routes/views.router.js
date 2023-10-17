import express from "express";
const router = express.Router();
import fs from 'fs'
import ProductManager from '../dao/fileManagers/ProductManager.js';
import { productsModel } from "../dao/models/products.model.js";
import Products from '../dao/dbManagers/products.manager.js';

const productsManager = new Products();


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
      user: req.session.user,
      result,
    });
  } catch (err) {
    console.error('Error al realizar la consulta paginada:', err);
    res.status(500).send('Error interno del servidor');
  }
});

router.get('/products', async (req, res) => {
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

const publicAccess = (req, res, next) => {
  if (req.session.user) return res.redirect('/profile');
  next();
}
const privateAcess = (req, res, next) => {

  if (!req.session.user) return res.redirect('/');
  next();
}

router.get('/register', publicAccess, (req, res) => {
  console.log(req);

  res.render('register');
});

router.get('/login', publicAccess, async (req, res) => {
  /*  const result = await productsModel.find();
 
   res.render('index', {
     style: 'index.css',
     result
   });*/
  res.render('login')
});

router.get('/profile', privateAcess, (req, res) => {
  res.render('profile', {
    user: req.session.user
  });
});

router.get('/chat', (req, res) => {
  res.render('chat', {})
});


export default router;
