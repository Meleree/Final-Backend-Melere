import express from "express";
import CartManager from './CartManager.js';
import ProductManager from './ProductManager.js';

const app = express();
app.use(express.json());

const cartManager = new CartManager();
const productManager = new ProductManager();

// Endpoints

//-----------rutas /api/products---------------------
//Debe listar todos los productos.
app.get('/api/products', async (req, res) => {
    const products = await productManager.getAllProducts();
    res.json({ products: products, message: "Lista de productos" });
});

//Debe traer solo el producto con el id proporcionado.
app.get('/api/products/:pid', async (req, res) => {
    const product = await productManager.getAProductById(req.params.pid);
    if (product) {
        res.json({ product: product, message: "Producto encontrado" });
    } else {
        res.status(404).json({ message: "Producto no encontrado" });
    }
});

//Debe agregar un nuevo producto
app.post('/api/products', async (req, res) => {
    const newProduct = req.body;
    const product = await productManager.createProduct(newProduct);
    res.status(201).json({ product: product, message: "Nuevo producto creado" });
});

//Debe actualizar un producto
app.put('/api/products/:id', async (req, res) => {
    const productId = parseInt(req.params.id, 10); 
    const updateData = req.body;
    const updatedProduct = await productManager.updateProductById(productId, updateData);
    if (updatedProduct) {
        res.status(200).json({ updatedProduct: updatedProduct, message: "Producto actualizado" });
    } else {
        res.status(404).json({ message: "Producto no encontrado" });
    }
});

//Debe eliminar el producto con el pid indicado
app.delete('/api/products/:id', async (req, res) => {
    const productId = parseInt(req.params.id, 10); 
    const products = await productManager.deleteProductById(productId);
    if (products) {
        res.status(200).json({ products: products, message: "Producto eliminado" });
    } else {
        res.status(404).json({ message: "Producto no encontrado" });
    }
});

//---------------rutas /api/carts------------------
//Debe crear un nuevo carrito vacío
app.post('/api/carts', async (req, res) => {
    const cart = await cartManager.addCart();
    res.status(201).json({ cart: cart, message: "Nuevo carrito creado" });
})

//Debe listar los productos que pertenecen al carrito
app.get('/api/carts/:cid', async(req, res) => {
    const cid = req.params.cid;
    const products = await cartManager.getProductsInCartById(cid);
    res.status(200).json({ products, message: "Lista de productos en el carrito" });
});

//Debe agregar el producto al carrito indicado
app.post('/api/carts/:cid/product/:pid', async (req, res) => {
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);
    const quantity = req.body.quantity;

    const carts = await cartManager.addProductInCart(cid, pid, quantity);
    res.status(200).json({ carts, message: "Producto añadido al carrito" });
})

app.listen(8080, () => {
    console.log('Servidor iniciado en el puerto 8080');
});
