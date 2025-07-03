const socket = io();

const productsList = document.getElementById('productsList');

// Función para cargar productos y actualizar la lista
async function loadProducts() {
  const res = await fetch('/api/products');
  const products = await res.json();
  productsList.innerHTML = '';
  products.forEach(prod => {
    const li = document.createElement('li');
    li.dataset.id = prod.id;
    li.innerHTML = `
      ${prod.title} - $${prod.price}
      <form action="/api/products/delete/${prod.id}" method="POST" style="display:inline;">
        <button type="submit">Eliminar</button>
      </form>
    `;
    productsList.appendChild(li);
  });
}

// Al conectar, carga la lista
socket.on('connect', () => {
  loadProducts();
});

// Cuando el servidor emite que hay cambios, recarga la lista
socket.on('productsUpdated', () => {
  loadProducts();
});
