import express from 'express';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import mongoose from 'mongoose';
import ProductManager from './managers/ProductManager.js';

const app = express();
const PORT = 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Motor de plantillas Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Test route (puedes eliminarla cuando sea necesario)
app.get('/test', (req, res) => {
  res.send('Ruta /test funcionando');
});

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/mi_ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Conectado a MongoDB'))
  .catch(error => console.error('Error al conectar a MongoDB:', error));

const httpServer = app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

const io = new Server(httpServer);
const productManager = new ProductManager();

// Middleware para pasar io en req
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

// WebSocket events
io.on('connection', async socket => {
  console.log('🔌 Cliente conectado');

  // Emite todos los productos al cliente
  const products = await productManager.getProducts({});
  socket.emit('products', products);

  // Agregar un producto
  socket.on('addProduct', async data => {
    await productManager.addProduct(data);
    const updated = await productManager.getProducts({});
    io.emit('products', updated);
  });

  // Eliminar un producto
  socket.on('deleteProduct', async id => {
    await productManager.deleteProduct(id);
    const updated = await productManager.getProducts({});
    io.emit('products', updated);
  });
});
