import express from 'express';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import ProductManager from './managers/ProductManager.js';

const app = express();
const PORT = 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.get('/test', (req, res) => {
  res.send('Ruta /test funcionando');
});

const httpServer = app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

const io = new Server(httpServer);
const productManager = new ProductManager('./src/data/products.json');

// Middleware para pasar io en req (debe ir antes de los routers)
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

io.on('connection', async socket => {
  console.log('🔌 Cliente conectado');

  const products = await productManager.getProducts();
  socket.emit('products', products);

  socket.on('addProduct', async data => {
    await productManager.addProduct(data);
    const updated = await productManager.getProducts();
    io.emit('products', updated);
  });

  socket.on('deleteProduct', async id => {
    await productManager.deleteProduct(id);
    const updated = await productManager.getProducts();
    io.emit('products', updated);
  });
});
