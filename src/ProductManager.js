import fs from "fs";

class ProductManager {
    constructor() {
        this.path = './src/products.json';
    }

//getProducts
getAllProducts = async () => {
    const productsJson = await fs.promises.readFile(this.path, 'UTF-8');
    return JSON.parse(productsJson);
}

//getProductById
getProductById = async (pid) => {
    const productsJson = await fs.promises.readFile(this.path, 'UTF-8');
    const products = JSON.parse(productsJson);
    return products.find((products) => products.id === parseInt(pid));
}

//addProduct
createProduct = async (product) => {
    const productsJson = await fs.promises.readFile(this.path, 'UTF-8');
    const products = JSON.parse(productsJson);
    const id = this.generateNewId(products);  // Llamamos al método generateNewId
    product.id = id;  // Asignamos el ID al producto
    products.push(product);
    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2), 'UTF-8');
    return product;
}

//updateProductById
updateProductById = async (id, updateData) => {
    const productsJson = await fs.promises.readFile(this.path, 'utf-8');
    const products = JSON.parse(productsJson);
    const product = products.find((product) => product.id === id);
    if (product) {
        Object.assign(product, updateData);  // Actualizamos los campos del producto
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2), 'utf-8');
        return product;
    }
    return null;
}

//deleteProductById
deleteProductById = async (id) => {
    const productsJson = await fs.promises.readFile(this.path, 'utf-8');
    const products = JSON.parse(productsJson);
    const updatedProducts = products.filter((product) => product.id !== id);
    await fs.promises.writeFile(this.path, JSON.stringify(updatedProducts, null, 2), 'utf-8');
    return updatedProducts;
};

//generateNewIdProduct
generateNewId = (products) => {
    if (products.length > 0) {
        return products[products.length - 1].id + 1;
    } else {
        return 1;
    }
}
};

export default ProductManager;