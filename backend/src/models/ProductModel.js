import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  thumbnail: {
    type: String,
    default: ''
  },
  status: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Plugin de paginación
productSchema.plugin(mongoosePaginate);

// Exportación del modelo
export const ProductModel = mongoose.models.Product || mongoose.model('Product', productSchema);
