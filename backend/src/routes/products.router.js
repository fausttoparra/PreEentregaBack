import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';

const router = Router();

const __dirname = dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, '..', 'data', 'products.json');

const manager = new ProductManager(filePath);

// GET productos para render views (si usás esta ruta para eso)
router.get('/', async (req, res) => {
  const products = await manager.getProducts();
  res.render('home', { products }); // O res.json(products) si API
});

// POST agregar producto (desde formulario HTTP)
router.post('/', async (req, res) => {
  await manager.addProduct(req.body);

  // Emitir evento socket a todos los clientes
  req.io.emit('productsUpdated');

  // Redirigir a la vista que muestra productos en tiempo real
  res.redirect('/realtimeproducts');
});

// POST eliminar producto (desde formulario HTTP)
router.post('/delete/:pid', async (req, res) => {
  await manager.deleteProduct(req.params.pid);

  req.io.emit('productsUpdated');

  res.redirect('/realtimeproducts');
});

export default router;
