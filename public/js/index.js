const socket = io();
const formNewProduct = document.getElementById("formNewProduct");
const productList = document.getElementById("productList");

// Enviar nuevo producto
formNewProduct.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(formNewProduct);
  const productData = {};
  formData.forEach((value, key) => {
    productData[key] = value;
  });
  socket.emit("newProduct", productData);
  formNewProduct.reset();
});

// Escuchar producto agregado y agregarlo al DOM
socket.on("productAdded", (newProduct) => {
  const li = document.createElement("li");
  li.setAttribute("data-id", newProduct.id);
  li.innerHTML = `${newProduct.title} - $${newProduct.price} 
    <button class="delete-btn" data-id="${newProduct.id}">Eliminar</button>`;
  productList.appendChild(li);
});

// Delegar clics en botones "Eliminar"
productList.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const productId = e.target.getAttribute("data-id");
    socket.emit("deleteProduct", productId);
  }
});

// Eliminar producto del DOM cuando el servidor lo confirma
socket.on("productDeleted", (id) => {
  const itemToDelete = document.querySelector(`li[data-id="${id}"]`);
  if (itemToDelete) {
    itemToDelete.remove();
  }
});
