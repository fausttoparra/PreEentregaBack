import { CartModel } from '../models/CartModel.js';
import mongoose from 'mongoose';

class CartManager {
  // Crear un carrito nuevo vacío
  async createCart() {
    try {
      const newCart = await CartModel.create({ products: [] });
      return newCart;
    } catch (error) {
      console.error('Error al crear el carrito:', error);
      throw error;
    }
  }

  // Obtener carrito por ID con populate
  async getCartById(cartId) {
    try {
      const cart = await CartModel.findById(cartId).populate('products.product');
      return cart;
    } catch (error) {
      console.error('Error al obtener el carrito:', error);
      throw error;
    }
  }

  // Agregar producto al carrito
  async addProductToCart(cartId, productId) {
    try {
      const cart = await CartModel.findById(cartId);
      if (!cart) return null;

      const existingProduct = cart.products.find(p => p.product.toString() === productId);

      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.products.push({ product: new mongoose.Types.ObjectId(productId), quantity: 1 });
      }

      await cart.save();
      return await cart.populate('products.product');
    } catch (error) {
      console.error('Error al agregar producto al carrito:', error);
      throw error;
    }
  }

  // Actualizar cantidad de un producto específico
  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const cart = await CartModel.findById(cartId);
      if (!cart) return null;

      const productInCart = cart.products.find(p => p.product.toString() === productId);
      if (!productInCart) return null;

      productInCart.quantity = quantity;
      await cart.save();
      return await cart.populate('products.product');
    } catch (error) {
      console.error('Error al actualizar cantidad:', error);
      throw error;
    }
  }

  // Eliminar un producto del carrito
  async removeProductFromCart(cartId, productId) {
    try {
      const cart = await CartModel.findById(cartId);
      if (!cart) return null;

      cart.products = cart.products.filter(p => p.product.toString() !== productId);
      await cart.save();
      return await cart.populate('products.product');
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      throw error;
    }
  }

  // Reemplazar todos los productos del carrito
  async replaceCartProducts(cartId, productsArray) {
    try {
      const cart = await CartModel.findById(cartId);
      if (!cart) return null;

      cart.products = productsArray.map(item => ({
        product: new mongoose.Types.ObjectId(item.product),
        quantity: item.quantity
      }));

      await cart.save();
      return await cart.populate('products.product');
    } catch (error) {
      console.error('Error al reemplazar productos del carrito:', error);
      throw error;
    }
  }

  // Vaciar el carrito
  async clearCart(cartId) {
    try {
      const cart = await CartModel.findById(cartId);
      if (!cart) return null;

      cart.products = [];
      await cart.save();
      return cart;
    } catch (error) {
      console.error('Error al vaciar el carrito:', error);
      throw error;
    }
  }
}

export default CartManager;
