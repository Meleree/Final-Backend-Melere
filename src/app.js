import express from "express";
import { engine } from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import { Server } from "socket.io";

// Importar routers
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";

// Definir rutas y estructura de directorios
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuración de Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Rutas de la aplicación
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// WebSocket para productos en tiempo real
let products = [];  // Almacenamiento temporal de productos (puedes cambiar a base de datos más adelante)

// Ruta para la vista principal con la lista de productos
app.get('/', (req, res) => {
  res.render('home', { products });
});

// Ruta para la vista de productos en tiempo real
app.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts', { products });
});

// Agregar un nuevo producto usando WebSocket
app.post('/add-product', (req, res) => {
  const newProduct = req.body.product;
  products.push(newProduct);
  
  // Emitir el nuevo producto a todos los clientes conectados
  io.emit('new-product', newProduct);
  
  res.redirect('/');  // Redirigir a la página principal
});

// Eliminar un producto
app.post('/delete-product', (req, res) => {
  const productToDelete = req.body.product;
  products = products.filter(p => p !== productToDelete);
  
  // Emitir la eliminación del producto
  io.emit('delete-product', productToDelete);

  res.redirect('/');  // Redirigir a la página principal
});

// Configuración de WebSockets
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');
  
  // Enviar la lista actualizada de productos a los nuevos clientes
  socket.emit('product-list', products);

  // Manejar desconexiones
  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

// Iniciar el servidor
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
