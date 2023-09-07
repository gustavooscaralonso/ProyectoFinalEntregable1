import fs from 'fs';

function addCart(products) {

  if (products == (undefined || null)) {
    console.log("Por favor, complete todos los campos");
    return
  }

  try {

    const carts = JSON.parse(fs.readFileSync('./carts.json'));
    const cartsLength = carts.length + 1;

    carts.push({
      cartId: cartsLength,
      products
    });

    fs.writeFile('./carts.json', JSON.stringify(carts), (err) => {

      if (err) {
        throw err;
      } else {
        console.log("Carrito añadido")
        console.log(carts)
      }
    })

  } catch (err) {
    throw err;
  }
}
function addProduct(cartId, productId, qty) {
  if (cartId == undefined || productId == undefined || qty == undefined || cartId === null || productId === null || qty === null) {
    console.log("Por favor, complete todos los campos");
    return;
  }

  try {
    let carts = JSON.parse(fs.readFileSync('./carts.json'));

    // Buscar el carrito con el cartId especificado
    const cart = carts.find(element => element.cartId === cartId);
    if (cart) {
      // Buscar el producto en el carrito con el productId especificado
      const product = cart.products.find(product => product.productId === productId);


      if (product) {
        // Actualizar la cantidad del producto existente
        product.quantity = qty; // Incrementa la cantidad existente

      } else {
        // Agregar un nuevo producto al carrito
        cart.products.push({
          "productId": parseInt(productId),
          "quantity": qty
        });
      }
    } else {
      // Si el carrito no existe, crear uno nuevo
      const newCart = {
        "cartId": cartId,
        "products": [
          {
            "productId": parseInt(productId),
            "quantity": qty
          }
        ]
      };
      carts.push(newCart);
    }

    // Escribir los cambios de vuelta en el archivo
    fs.writeFileSync('./carts.json', JSON.stringify(carts, null, 2));

    console.log("Modificación exitosa");
  } catch (err) {
    throw err;
  }
}


/* 
function addProduct(cartId, productId, qty) {

  if (cartId, productId, qty == (undefined || null)) {
    console.log("Por favor, complete todos los campos");
    return
  }

  try {
    const carts = JSON.parse(fs.readFileSync('./carts.json'))
    const cartIndex = carts.findIndex(cart => cart.cartId === cartId);

    if (cartIndex !== -1) {
      const cart = carts[existsCart]
      const productIndex = cart.products.findIndex(cart => cart.cartId === cartId)

      if (productIndex !== -1) {
        cart.products[productIndex].quantity += qty
      } else {

        cart.products.push({
          "productId": parseInt(productId),
          "quantity": qty
        });

      }
    } else {
      const newCart = {
        "cartId": cartId,
        "products": [
          {
            "productId": parseInt(productId),
            "quantity": quantity
          }]
      }
      carts.push(newCart)

      fs.writeFile('./carts.json', JSON.stringify(carts), (err) => {
        if (err) {
          throw new Error("No se pudo actualizar el producto")
        } else {
          console.log("Modificación exitosa");
        }
      })
    }

  } catch (err) {
    throw err;
  }
}
 */
/* function addProduct(cartId, productId, qty) {

  if (cartId, productId, qty == (undefined || null)) {
    console.log("Por favor, complete todos los campos");
    return
  }

  try {
    const carts = JSON.parse(fs.readFileSync('./carts.json'))
    const cart = carts.find(element => element.cartId === cartId)

    let existsCart = carts.find(cart => cart.cartId === cartId);
    let existsProduct = cart.products.find(cart => cart.cartId === cartId);

    const newProduct = {
      "productId": parseInt(productId),
      "quantity": qty
    }

    if (existsCart) {
      if (existsProduct) {
        newProduct.quantity += qty
        existsCart.products.push(newProduct)
      } else {
        existsCart.products.push(newProduct)

        fs.writeFile('./carts.json', JSON.stringify(carts), (err) => {
          if (err) {
            throw new Error("No se pudo actualizar el producto")
          } else {
            console.log("Modificación exitosa");
          }
        })
      }
    } else {
      const newCart = {
        "cartId": cartId,
        "products": [
          {
            "productId": parseInt(productId),
            "quantity": quantity
          }]
      }
      carts.push(newCart)

      fs.writeFile('./carts.json', JSON.stringify(carts), (err) => {
        if (err) {
          throw new Error("No se pudo actualizar el producto")
        } else {
          console.log("Modificación exitosa");
        }
      })
    }

  } catch (err) {
    throw err;
  }
}
 */

export { addCart, addProduct }
