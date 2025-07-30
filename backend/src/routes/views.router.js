import express from 'express';
import ProductManager from '../managers/ProductManager.js';
import { ProductModel } from '../models/ProductModel.js';
import { CartModel } from '../models/CartModel.js';

const router = express.Router();
const productManager = new ProductManager();

// Vista principal con paginación
router.get('/products', async (req, res) => {
  try {
    const { limit, page, sort, query } = req.query;
    const result = await productManager.getProducts({ limit, page, sort, query });

    res.render('products', {
      products: result.payload,
      pagination: {
        page: result.page,
        totalPages: result.totalPages,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.prevLink,
        nextLink: result.nextLink
      }
    });
  } catch (error) {
    console.error('Error al renderizar productos:', error);
    res.status(500).send('Error al cargar los productos');
  }
});

// Vista en tiempo real (WebSocket)
router.get('/realtimeproducts', async (req, res) => {
  try {
    const result = await productManager.getProducts({ limit: 100 });
    res.render('realTimeProducts', { products: result.payload });
  } catch (error) {
    console.error('Error en /realtimeproducts:', error);
    res.status(500).send('Error al cargar productos en tiempo real');
  }
});

// Vista de detalle del producto
router.get('/products/:pid', async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.pid).lean();
    if (!product) return res.status(404).send('Producto no encontrado');
    res.render('productDetail', { product });
  } catch (error) {
    console.error('Error al cargar detalle del producto:', error);
    res.status(500).send('Error al cargar producto');
  }
});

// Vista de carrito por ID
router.get('/carts/:cid', async (req, res) => {
  try {
    const cart = await CartModel.findById(req.params.cid).populate('products.product').lean();
    if (!cart) return res.status(404).send('Carrito no encontrado');
    res.render('cartDetail', { cart });
  } catch (error) {
    console.error('Error al cargar carrito:', error);
    res.status(500).send('Error al cargar carrito');
  }
});

export default router;
