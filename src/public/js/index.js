/* const socket = io();

socket.on('actualizar-productos', (productos) => {
  const productsDiv = document.getElementById('products');

  //productsDiv.innerHTML = "";

  if (productos && productos.length > 0) {
    productos.forEach(productoObj => {
      const product = productoObj.product;
      const $p = document.createElement('p');
      $p.textContent = product;
      productsDiv.appendChild($p)
    });
  }

}) */