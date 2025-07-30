const socket = io();

const productsList = document.getElementById('productsList');

// Cargar productos desde la API
async function loadProducts() {
  try {
    const res = await fetch('/api/products');
    const data = await res.json();
    const products = data.payload;

    productsList.innerHTML = '';

    products.forEach(prod => {
      const li = document.createElement('li');
      li.dataset.id = prod._id;

      li.innerHTML = `
        ${prod.title} - $${prod.price}
        <button data-id="${prod._id}" class="delete-btn">Eliminar</button>
      `;

      productsList.appendChild(li);
    });

    // Añadir eventos a los botones de eliminar
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const productId = e.target.dataset.id;
        await deleteProduct(productId);
      });
    });

  } catch (error) {
    console.error('Error al cargar productos:', error);
  }
}

// Eliminar producto por ID usando fetch
async function deleteProduct(id) {
  try {
    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE'
    });

    if (res.ok) {
      console.log('Producto eliminado');
      socket.emit('productDeleted'); // Podés emitir algo si querés notificar al servidor
    } else {
      console.error('Error al eliminar producto');
    }
  } catch (error) {
    console.error('Error al eliminar producto:', error);
  }
}

// Al conectar, cargar productos
socket.on('connect', () => {
  loadProducts();
});

// Si el servidor avisa que se actualizaron, recargar
socket.on('productsUpdated', () => {
  loadProducts();
});
