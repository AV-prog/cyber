const items = document.getElementById("items");
const total = document.getElementById("total");

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let totalPrice = localStorage.getItem("totalprice");

total.innerText = `$${totalPrice}`;

cart.forEach(item => {
    const div = document.createElement("div");
    div.className = "flex items-center gap-4 bg-gray-100 rounded-xl p-5";

    const image = document.createElement("img");
    image.src = item.image;
    image.className = "w-12 h-12 object-contain";
    image.alt = item.name;

    const nameDiv = document.createElement("div");
    nameDiv.className = "flex-1";

    const phoneName = document.createElement("p");
    phoneName.className = "text-sm font-medium";
    phoneName.textContent = `${item.name}`;

    const quantity = document.createElement("p");
    quantity.className = "text-xs text-gray-500 mt-1";
    quantity.textContent = `${item.storage} • Qty: ${item.quantity}`;

    nameDiv.appendChild(phoneName);
    nameDiv.appendChild(quantity);

    const phonePrice = document.createElement("p");
    phonePrice.textContent = `$${item.unitPrice * item.quantity}`;
    phonePrice.className = "font-bold";

    div.appendChild(image);
    div.appendChild(nameDiv);
    div.appendChild(phonePrice);

    items.appendChild(div);
});