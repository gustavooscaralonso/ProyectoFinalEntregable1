import express from 'express';
import handlebars from 'express-handlebars';
import productRoutes from './routes/productRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import __dirname from "./pathsConfig.js";
import viewRouter from "./routes/views.router.js";
import { Server } from "socket.io";
import fs from 'fs'
import ProductManager from './ProductManager.js';
let pm = new ProductManager();


const app = express();
const httpServer = app.listen(8080, () => console.log('Servidor corriendo en puerto 8080'));

const socketServer = new Server(httpServer)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + "/public"));

app.use('/', viewRouter)
app.use('/api/carts', cartRoutes)
app.use('/api/products', productRoutes)

const products = await pm.getProducts()
//const products = JSON.parse(fs.readFileSync('product.json'));
socketServer.on('connection', socket => {

  socket.emit('actualizar-productos', products)

  socket.on('agregar', (newProduct) => {

    const { title, description, price, category, thumbnail, code, stock } = newProduct;

    const productoAgregado = {
      Titulo: title,
      Descripcion: description,
      Precio: price,
      Estado: true,
      Categoria: category,
      Imagen: thumbnail,
      Codigo: code,
      Stock: stock
    }
    products.push(productoAgregado)
    console.log(productoAgregado);

    socketServer.emit('actualizar-productos', products)

  })
})
