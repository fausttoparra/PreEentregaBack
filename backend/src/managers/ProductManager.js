import fs from 'fs/promises';

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async _readFile() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      // Si no existe el archivo, devuelve array vacío
      if (error.code === 'ENOENT') return [];
      throw error;
    }
  }

  async _writeFile(data) {
    await fs.writeFile(this.path, JSON.stringify(data, null, 2));
  }

  async getProducts() {
    return await this._readFile();
  }

  async getProductById(id) {
    const products = await this._readFile();
    return products.find(p => p.id == id);
  }

  async addProduct(productData) {
    const products = await this._readFile();

    // Generar ID único
    const newId = products.length > 0 ? products[products.length - 1].id + 1 : 1;

    const newProduct = {
      id: newId,
      ...productData
    };

    products.push(newProduct);
    await this._writeFile(products);

    return newProduct;
  }

  async updateProduct(id, updateData) {
    const products = await this._readFile();
    const index = products.findIndex(p => p.id == id);

    if (index === -1) return null;

    // No se actualiza el id
    delete updateData.id;

    products[index] = { ...products[index], ...updateData };
    await this._writeFile(products);

    return products[index];
  }

  async deleteProduct(id) {
    let products = await this._readFile();
    const initialLength = products.length;
    products = products.filter(p => p.id != id);

    if (products.length === initialLength) return false;

    await this._writeFile(products);
    return true;
  }
}

export default ProductManager;
