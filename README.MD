# 🛒 Entrega Final Backend - Ecommerce

Proyecto desarrollado como entrega final del curso Backend de Coderhouse.

---

## 🚀 Tecnologías utilizadas

- Node.js
- Express
- MongoDB + Mongoose
- Handlebars
- Socket.io (para actualización en tiempo real)

---

## ✅ Funcionalidades implementadas

- CRUD completo de productos y carritos
- Persistencia con MongoDB
- Filtros, paginación y orden en productos
- Populate en carritos (relación con productos)
- Vistas con Handlebars
- Actualización en tiempo real con WebSocket

---

## 📦 Rutas principales

### Productos
- `GET /api/products` → productos con filtros, paginación y orden
- `GET /api/products/:pid` → obtener producto por ID
- `POST /api/products` → agregar producto
- `DELETE /api/products/:pid` → eliminar producto
- `GET /products` → vista paginada con botones
- `GET /products/:pid` → vista detalle del producto
- `GET /realtimeproducts` → vista en tiempo real (socket)

### Carritos
- `POST /api/carts/` → crear carrito
- `GET /api/carts/:cid` → obtener carrito con productos (populate)
- `PUT /api/carts/:cid` → reemplazar productos del carrito
- `PUT /api/carts/:cid/products/:pid` → actualizar cantidad
- `DELETE /api/carts/:cid/products/:pid` → eliminar producto
- `DELETE /api/carts/:cid` → vaciar carrito
- `POST /api/carts/:cid/product/:pid` → agregar producto al carrito
- `GET /carts/:cid` → vista del carrito

---

## 🔧 Instrucciones para correr el proyecto

1. Cloná este repositorio:

```bash
git clone REPO_URL
cd nombre-del-proyecto
