const socket = io();
let user;
let chatBox = document.getElementById('chatBox')

if (window.location.href === 'http://localhost:8080/chat') {
  Swal.fire({
    title: "Identificate",
    input: "text",
    text: "nick",
    inputValidator: (value) => {
      return !value && "ingresa tu nick"
    },
    allowOutsideClick: false
  }).then(result => {
    user = result.value;

    socket.emit('authenticate');

    socket.on('messageLogs', data => {
      let log = document.getElementById('messageLogs');
      let messages = '';
      data.forEach(message => {
        messages = messages + `${message.user} dice: ${message.message}</br>`;
      });
      log.innerHTML = messages;
    })
  });

  chatBox.addEventListener('keyup', evt => {
    if (evt.key === "Enter") {
      if (chatBox.value.trim().length > 0) {
        socket.emit('message', { user: user, message: chatBox.value })
        chatBox.value = ''
      }
    }
  })
};

socket.on('messageLogs', data => {
  let log = document.getElementById('messageLogs');
  let messages = '';
  data.forEach(message => {
    messages = messages + `${message.user} dice: ${message.message}</br>`;
  });
  log.innerHTML = messages;
})

socket.on('userConnected', data => {
  Swal.fire({
    text: "Nuevo usuario conectado",
    toast: true,
    position: "top-right"
  });
});




/* 
CODIGO PARA ACTUALIZAR EN TIEMPO REAL LOS PRODUCTOS CUANDO SON AGREGADOS, ELIMINADOS O ACTUALIZADOS
const socket = io();


//AGREGA Y ACTUALIZA UN PRODUCTO
socket.on('add-product', (newProduct) => {
  const { title, description, priceInt, category, thumbnail, code, stockInt } = newProduct;

  const productsDiv = document.getElementById('products');

  const $ptitle = document.createElement('p');
  $ptitle.textContent = "Titulo: ";
  const $stitle = document.createElement('span');
  $stitle.style.fontWeight = "100";
  $stitle.textContent = title;
  $stitle.setAttribute('class', 'titulo');
  $ptitle.appendChild($stitle);

  const $pdescription = document.createElement('p');
  $pdescription.textContent = "Descripcion: ";
  const $sdescription = document.createElement('span');
  $sdescription.style.fontWeight = "100";
  $sdescription.textContent = description;
  $sdescription.setAttribute('class', 'description');
  $pdescription.appendChild($sdescription)

  const $pprice = document.createElement('p');
  $pprice.textContent = "Precio: ";
  const $sprice = document.createElement('span');
  $sprice.style.fontWeight = "100";
  $sprice.textContent = priceInt;
  $sprice.setAttribute('class', 'price');
  $pprice.appendChild($sprice);

  const $pstatus = document.createElement('p');
  $pstatus.textContent = "Estado: ";
  const $sstatus = document.createElement('span');
  $sstatus.style.fontWeight = "100";
  $sstatus.textContent = "true";
  $pstatus.appendChild($sstatus);

  const $pcategory = document.createElement('p');
  $pcategory.textContent = "Categoria: ";
  const $scategory = document.createElement('span');
  $scategory.style.fontWeight = "100";
  $scategory.textContent = category;
  $scategory.setAttribute('class', 'category');
  $pcategory.appendChild($scategory);

  const $pthumbnail = document.createElement('p');
  $pthumbnail.textContent = "Imagen: ";
  const $sthumbnail = document.createElement('span');
  $sthumbnail.style.fontWeight = "100";
  $sthumbnail.textContent = thumbnail;
  $sthumbnail.setAttribute('class', 'thumbnail');
  $pthumbnail.appendChild($sthumbnail);

  const $pcode = document.createElement('p');
  $pcode.textContent = "Codigo: ";
  const $scode = document.createElement('span');
  $scode.style.fontWeight = "100";
  $scode.textContent = code;
  $scode.setAttribute('class', 'code');
  $pcode.appendChild($scode);

  const $pstock = document.createElement('p');
  $pstock.textContent = "Stock: ";
  const $sstock = document.createElement('span');
  $sstock.style.fontWeight = "100";
  $sstock.textContent = stockInt;
  $sstock.setAttribute('class', 'stock');
  $pstock.appendChild($sstock);


  const $product = document.createElement('div');
  $product.style.border = ".1px solid black";
  $product.style.borderRadius = "10px";
  $product.style.margin = "2rem";
  $product.style.padding = "1rem";

  $product.appendChild($ptitle)
  $product.appendChild($pdescription)
  $product.appendChild($pprice)
  $product.appendChild($pstatus)
  $product.appendChild($pcategory)
  $product.appendChild($pthumbnail)
  $product.appendChild($pcode)
  $product.appendChild($pstock)

  productsDiv.appendChild($product)

});

socket.on('add-product-error', (data) => {
  alert(data);
});

//ACTUALIZA UN PRODUCTO
socket.on('update-product', (updatedProduct) => {
  const code = updatedProduct.code;

  var spanCode = document.querySelector('.products');
  console.log(spanCode);



}); */