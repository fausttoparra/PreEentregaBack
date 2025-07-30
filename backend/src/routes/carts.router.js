import express from 'express';
import CartManager from '../managers/CartManager.js';

const router = express.Router();
const cartManager = new CartManager(); // ya no necesita path a JSON

// Crear un nuevo carrito
router.post('/', async (req, res) => {
  const newCart = await cartManager.createCart();
  res.status(201).json(newCart);
});

// Obtener un carrito con productos poblados
router.get('/:cid', async (req, res) => {
  const cart = await cartManager.getCartById(req.params.cid);
  cart ? res.json(cart) : res.status(404).send('Carrito no encontrado');
});

// Agregar un producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
  const updatedCart = await cartManager.addProductToCart(req.params.cid, req.params.pid);
  updatedCart ? res.json(updatedCart) : res.status(404).send('Carrito o producto no encontrado');
});

// Actualizar la cantidad de un producto específico
router.put('/:cid/products/:pid', async (req, res) => {
  const { quantity } = req.body;
  const updatedCart = await cartManager.updateProductQuantity(req.params.cid, req.params.pid, quantity);
  updatedCart ? res.json(updatedCart) : res.status(404).send('No se encontró carrito o producto');
});

// Reemplazar todos los productos del carrito con un array
router.put('/:cid', async (req, res) => {
  const { products } = req.body;
  const updatedCart = await cartManager.replaceCartProducts(req.params.cid, products);
  updatedCart ? res.json(updatedCart) : res.status(404).send('Carrito no encontrado');
});

// Eliminar un producto específico del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
  const updatedCart = await cartManager.removeProductFromCart(req.params.cid, req.params.pid);
  updatedCart ? res.json(updatedCart) : res.status(404).send('No se encontró carrito o producto');
});

// Vaciar todo el carrito
router.delete('/:cid', async (req, res) => {
  const clearedCart = await cartManager.clearCart(req.params.cid);
  clearedCart ? res.json(clearedCart) : res.status(404).send('Carrito no encontrado');
});

export default router;
