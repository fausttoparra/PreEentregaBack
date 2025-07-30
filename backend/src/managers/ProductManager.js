import { ProductModel } from '../models/ProductModel.js'; // Usamos el modelo externo

class ProductManager {
  constructor() {}

  // Obtener productos con filtros, paginación y ordenamiento
  async getProducts({ limit = 10, page = 1, sort = '', query = '' }) {
    try {
      const filters = {};

      if (query) {
        filters.$or = [
          { title: { $regex: query, $options: 'i' } },
          { category: { $regex: query, $options: 'i' } },
        ];
      }

      const sortOption = sort === 'asc'
        ? { price: 1 }
        : sort === 'desc'
        ? { price: -1 }
        : {};

      const products = await ProductModel.find(filters)
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

      const total = await ProductModel.countDocuments(filters);
      const totalPages = Math.ceil(total / limit);

      return {
        status: "success",
        payload: products,
        totalPages,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page < totalPages ? page + 1 : null,
        page: Number(page),
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
        prevLink: page > 1 ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
        nextLink: page < totalPages ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
      };
    } catch (error) {
      console.error('Error al obtener los productos:', error);
      return { status: 'error', message: 'Error al obtener los productos' };
    }
  }

  // Agregar un nuevo producto
  async addProduct(productData) {
    try {
      const newProduct = await ProductModel.create(productData);
      return { status: 'success', message: 'Producto agregado', product: newProduct };
    } catch (error) {
      console.error('Error al agregar el producto:', error);
      return { status: 'error', message: 'No se pudo agregar el producto' };
    }
  }

  // Eliminar un producto por ID
  async deleteProduct(productId) {
    try {
      await ProductModel.findByIdAndDelete(productId);
      return { status: 'success', message: 'Producto eliminado' };
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      return { status: 'error', message: 'No se pudo eliminar el producto' };
    }
  }

  // Obtener un producto por ID
  async getProductById(productId) {
    try {
      const product = await ProductModel.findById(productId).lean();
      return product;
    } catch (error) {
      console.error('Error al obtener producto por ID:', error);
      return null;
    }
  }
}

export default ProductManager;
