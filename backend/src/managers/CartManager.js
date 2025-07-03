import fs from 'fs/promises';

class CartManager {
  constructor(path) {
    this.path = path;
  }

  // Leer el archivo y devolver el contenido parseado o un array vacío si no existe
  async _readFile() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        // Archivo no existe, lo crea vacío
        await this._writeFile([]);
        return [];
      }
      throw error;
    }
  }

  // Escribir datos en el archivo
  async _writeFile(data) {
    await fs.writeFile(this.path, JSON.stringify(data, null, 2));
  }

  // Crear un carrito nuevo con id autoincremental y productos vacío
  async createCart() {
    const carts = await this._readFile();
    const newId = carts.length > 0 ? carts[carts.length - 1].id + 1 : 1;
    const newCart = { id: newId, products: [] };
    carts.push(newCart);
    await this._writeFile(carts);
    return newCart;
  }

  // Obtener carrito por ID
  async getCartById(id) {
    const carts = await this._readFile();
    return carts.find(cart => cart.id === Number(id));
  }

  // Agregar producto al carrito: si ya existe, incrementar quantity, sino agregarlo
  async addProductToCart(cartId, productId) {
    const carts = await this._readFile();
    const cart = carts.find(c => c.id === Number(cartId));
    if (!cart) return null;

    // Buscar producto dentro del carrito
    const productInCart = cart.products.find(p => p.product === Number(productId));

    if (productInCart) {
      productInCart.quantity += 1;
    } else {
      cart.products.push({ product: Number(productId), quantity: 1 });
    }

    await this._writeFile(carts);
    return cart;
  }
}

export default CartManager;
