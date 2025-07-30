import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Asegurate de que este nombre coincida con el modelo exportado en ProductModel.js
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        default: 1
      }
    }
  ]
}, {
  timestamps: true // Agrega createdAt y updatedAt automáticamente
});

// Verifica si ya existe el modelo antes de crearlo (opcional, pero útil en algunos entornos)
export const CartModel = mongoose.models.Cart || mongoose.model('Cart', cartSchema);
