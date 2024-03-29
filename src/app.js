import express from 'express';
import handlebars from 'express-handlebars';
import productRoutes from './routes/products.router.js'
import cartRoutes from './routes/carts.router.js'
import __dirname from "./pathsConfig.js";
import viewRouter from "./routes/views.router.js";
import { Server } from "socket.io";
import mongoose from "mongoose";
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { productsModel } from './dao/models/products.model.js';
import sessionsRouter from "./routes/sessions.router-bcrypt.js";
import initializePassport from './config/passport.config.js';
import passport from 'passport';


const app = express();
const httpServer = app.listen(8080, () => console.log('Servidor corriendo en puerto 8080'));

//export const socketServer = new Server(httpServer)
export const io = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + "/public"));

try {
  await mongoose.connect('mongodb+srv://gustavoarctic:vkIEmeZkdkBFZXhy@cluster0.wymgg06.mongodb.net/CoderHouse?retryWrites=true');
  console.log('DB connected');
} catch (error) {
  console.log('ERROR: ' + error.message);
}

app.use(session({
  store: MongoStore.create({
    client: mongoose.connection.getClient(),
    ttl: 3600
  }),
  secret: 'Coder47300Secret',
  resave: true,
  saveUninitialized: true,
}));

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use('/', viewRouter);
app.use('/api/carts', cartRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sessions', sessionsRouter);

let messages = [];

io.on('connection', socket => {

  socket.on('authenticate', () => {
    socket.emit('messageLogs', messages)
  });

  socket.on('message', data => {
    messages.push(data);
    io.emit('messageLogs', messages)
  });

  socket.broadcast.emit('userConnected', { user: 'Nuevo usuario conectado' })
});
