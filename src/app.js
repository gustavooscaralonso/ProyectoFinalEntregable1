import express from 'express';
import productRoutes from './routes/productRoutes.js'
import cartRoutes from './routes/cartRoutes.js'

const app = express();
app.listen(8080, () => console.log('Servidor corriendo en puerto 8080'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/', (req, res) => {
  res.send("Escuchando en puerto 8080")
})
app.use('/api/carts', cartRoutes)
app.use('/api/products', productRoutes)


