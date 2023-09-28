//HAREMOS LA CLASE CART MANAGER PARA MANTENER LA PROLIJIDAD EN EL CÓDIGO
//LOS MÉTODOS SERÁN MUY SIMILARES A LOS DE PRODUCT MANAGER
import fs from "node:fs";

export class CartManager {

    constructor() {
        if (!fs.existsSync('carts.json')) {
            fs.writeFileSync('carts.json', '[]');
        }
        this.path = 'carts.json';

        //HAREMOS PÚBLICA EL ARRAY DE CARRITOS PORQUE DE OTRA MANERA TENDRÍAMOS
        //QUE HACER LA FUNCIÓN getCarts PARA MANTENER EL ENCAPSULAMIENTO, QUE EN ESTE
        //CASO SERÍA INNECESARIO PORQUE COMPLICARÍA LA LÓGICA DE LAS FUNCIONES DE LA APP
        this.carts = JSON.parse(fs.readFileSync(this.path));
    }

    addCart() {

        let carts = this.carts;

        carts.push({
            //LA LÓGICA DE LOS ID DEPENDE MUCHO DEL TIPO DE PROYECTO, A NOSOTROS NOS BASTA
            //CON HACERLO CON EL LARGO DEL ARRAY POR AHORA
            id: this.carts.length + 1,
            products: []
        })
        fs.writeFile(this.path, JSON.stringify(carts), (err) => {
            if (err) {
                throw err
            }
        });
    }

    //CON ESTE METODO RECUPERAMOS LOS PRODUCTOS DE CADA CARRITO POR ID
    getProductsByCartId(id) {
        try {
            const cart = this.carts.find(cart => cart.id == id);

            if (!cart) {
                throw new Error("El carrito con el id solicitado no existe")
            }
            else {
                return cart.products;
            }
        }
        catch (err) {
            throw err;
        }
    }

    //ESTA ES UN METODO PRIVADO
    //AL IGUAL QUE LAS PROPIEDADES PRIVADAS, SOLO SON ACCESIBLES DENTRO DE LA CLASE
    //QUE LA DECLARA, ES DECIR, SIRVEN PARA HACER OPERACIONES INTERNAS A LA CLASE CUANDO 
    //ESA OPERACION NO NECESITA DEVOLVER EL DATO A OTRA PARTE DE LA APLICACIÓN

    //EN ESTE CASO, VAMOS A MODIFICAR EL ARRAY DE PRODUCTOS DEL CARRITO
    #addProductToCart(cartId, productId) {

        try {
            //NECESITAMOS TOMAR EL ID DEL CARRITO Y CON ESO RECUPERAR LOS PRODUCTOS
            const cartProducts = this.getProductsByCartId(cartId);

            //LUEGO, VERIFICAR SI ENTRE LOS PRODUCTOS EXISTE ALGUNO CON EL ID 
            //PROPORCIONADO
            const existingProduct = cartProducts.find(product => product.product == productId);

            //CREAMOS EL PRODUCTO A GUARDAR/ACTUALIZAR CON SU id
            const updatedOrNewProduct = {
                product: productId
            }

            //COMO NO HAY PROPIEDAD quantity, LA CREAREMOS SEÚN EL CASO

            //SI EL PRODUCTO NO EXISTE, quantity SERÁ 1
            if (!existingProduct) {
                updatedOrNewProduct.quantity = 1;
                //AÑADIMOS EL PRODUCTO
                cartProducts.push(updatedOrNewProduct)
            } else {
                //CASO CONTRARIO, SERÁ AUMENTADO EN 1 SU NUMERO
                updatedOrNewProduct.quantity = existingProduct.quantity + 1;
                //HACEMOS EL SPLICE PARA ACTUALIZAR
                cartProducts.splice(cartProducts.indexOf(existingProduct), 1, updatedOrNewProduct);
                //EL SPLICE DA ERRORES SI NO SE ENCUENTRA EL PRODUCTO
            }

            //ESTE METODO SOLO RETORNARÁ UN SPLICE DEL ARRAY DE PRODUCTOS DEL CARRITO
            //Y LO RECUPERAREMOS EN EL SIGUIENTE METODO

            return cartProducts
        }
        catch (err) {
            throw err;
        }
    }

    //ESTE NUEVO MÉTODO SERÁ EL RESPONSABLE DE SOBREESCRIBIR EL REGISTO DE carts.json
    updateCartsProducts(cartId, productId) {

        try {
            //UNA VEZ MAS, NECESITAMOS EL ID DEL CARRITO, ESTA VEZ PARA UBICARLO
            //DENTRO DE LA LISTA DE CARRITOS. RECORDEMOS QUE NO TENEMOS UN MÉTODO
            //getCartById YA QUE NO NECESITAMOS QUE ESE DATO SEA DEVUELTO POR LA APP
            const cartToUpdate = this.carts.find(cart => cart.id == cartId);

            //ASIGNAMOS AL CARRITO QUE QUEREMOS ACTUALIZAR EL ARRAY DEVUELTO POR EL
            //METODO PRIVADO
            cartToUpdate.products = this.#addProductToCart(cartId, productId);

            //CON LA ASIGNACION HECHA, YA PODEMOS HACER UN SPLICE DEL ARRAY DE CARRITOS
            //Y GUARDAR LA INFORMACION
            this.carts.splice(this.carts.indexOf(cartToUpdate), 1, cartToUpdate);

            fs.writeFile(this.path, JSON.stringify(this.carts), (err) => {
                if (err) {
                    throw err;
                }
            });
        }
        catch (err) {
            throw err;
        }

    }
}