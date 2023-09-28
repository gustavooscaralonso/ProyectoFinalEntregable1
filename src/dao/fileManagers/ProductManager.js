import fs from 'fs';
import { io } from '../../app.js';


if (!fs.existsSync('product.json')) {
    fs.writeFileSync('product.json', '[]');
}

class ProductManager {
    constructor() {
        this.path = 'product.json';
        this.products = JSON.parse(fs.readFileSync(this.path));
    }

    getProducts() {
        return this.products;
    }

    addProduct(title, description, price, state = true, category, thumbnail, code, stock) {

        if (title, description, price, state, category, thumbnail, code, stock === (undefined || null || "")) {
            console.log("Por favor, complete todos los campos");
            return
        }

        try {
            const existingProduct = this.getProducts().some(element => {
                return element.code === code
            })
            if (existingProduct) {
                console.log(`Código ${code} ya existente`);
                return
            } else {
                const products = this.getProducts();

                products.push({
                    id: this.getProducts().length + 1,
                    title,
                    description,
                    price,
                    state,
                    category,
                    thumbnail,
                    code,
                    stock
                });

                fs.writeFile(this.path, JSON.stringify(products), (err) => {

                    if (err) {
                        throw err;
                    } else {
                        console.log("Producto añadido")
                        console.log(products)
                    }
                })
            }
        } catch (err) {
            throw err;
        }
    }

    updateProduct(productId, {
        newTitle,
        newDescription,
        newPrice,
        newThumbnail,
        newState,
        newCategory,
        newCode,
        newStock
    }) {

        try {
            const productToUpdate = this.getProductById(productId);
            let list = this.getProducts();

            let updatedProduct = {
                id: productToUpdate.id,
                title: newTitle ?? productToUpdate.title,
                description: newDescription ?? productToUpdate.description,
                price: newPrice ?? productToUpdate.price,
                state: newState ?? productToUpdate.state,
                category: newCategory ?? productToUpdate.category,
                thumbnail: newThumbnail ?? productToUpdate.thumbnail,
                code: newCode ?? productToUpdate.code,
                stock: newStock ?? productToUpdate.stock
            }
            list.splice(list.indexOf(productToUpdate), 1, updatedProduct)
            fs.writeFile(this.path, JSON.stringify(list), (err) => {
                if (err) {
                    throw new Error("No se pudo actualizar el producto")
                } else {
                    console.log("Modificación exitosa");
                }
            })
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    deleteProduct(id) {
        try {
            const productToDelete = this.getProductById(id);
            let list = this.getProducts();

            list.splice(list.indexOf(productToDelete), 1);

            fs.writeFile(this.path, JSON.stringify(list), (err) => {
                if (err) {
                    throw new Error("No se pudo eliminar el producto");
                } else {
                    console.log("Eliminación exitosa");
                }
            })
        } catch (err) {
            if (err) {
                throw err;
            }
        }
    }

    getProductById(id) {

        try {
            const product = this.getProducts().find(element => element.id == id)

            if (!product) {
                throw new Error("Not Found")
            } else {
                return product;
            }
        } catch (err) {
            throw err;
        }
    }
}

export default ProductManager
