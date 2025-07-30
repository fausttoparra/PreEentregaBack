import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const manager = new ProductManager();

// GET /api/products?limit=&page=&sort=&query=
router.get('/', async (req, res) => {
  try {
    const { limit, page, sort, query } = req.query;
    const result = await manager.getProducts({ limit, page, sort, query });
    res.json(result);
  } catch (error) {
    console.error('Error en GET /api/products:', error);
    res.status(500).json({ status: 'error', message: 'Error al obtener productos' });
  }
});

// GET /api/products/:pid
router.get('/:pid', async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.pid).lean();
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    }
    res.json({ status: 'success', payload: product });
  } catch (error) {
    console.error('Error en GET /api/products/:pid:', error);
    res.status(500).json({ status: 'error', message: 'Error al obtener el producto' });
  }
});

// POST /api/products
router.post('/', async (req, res) => {
  try {
    await manager.addProduct(req.body);
    req.app.get('io').emit('productsUpdated');
    res.status(201).json({ status: 'success', message: 'Producto agregado' });
  } catch (error) {
    console.error('Error en POST /api/products:', error);
    res.status(500).json({ status: 'error', message: 'No se pudo agregar el producto' });
  }
});

// DELETE /api/products/:pid
router.delete('/:pid', async (req, res) => {
  try {
    await manager.deleteProduct(req.params.pid);
    req.app.get('io').emit('productsUpdated');
    res.json({ status: 'success', message: 'Producto eliminado' });
  } catch (error) {
    console.error('Error en DELETE /api/products/:pid:', error);
    res.status(500).json({ status: 'error', message: 'No se pudo eliminar el producto' });
  }
});

export default router;
