const cartContainer = document.getElementById("cart");
const container = document.getElementById("container");
const emptyCartMsg = document.getElementById("emptyCartMsg");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function updateEmptyState() {
    if (cart.length === 0) {
        emptyCartMsg.classList.remove("hidden");
        container.classList.add("hidden");
    } else {
        emptyCartMsg.classList.add("hidden");
        container.classList.remove("hidden");
    }
}

updateEmptyState();

cart.forEach(item => {
    const div = document.createElement("div");
    div.dataset.id = item.id;
    div.className =
        "mt-6 flex w-full flex-col gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-center sm:justify-between hover:bg-gray-50 transition px-4";

    const img = document.createElement("img");
    img.className =
        "mx-auto sm:mx-0 w-[110px] sm:w-[90px] object-contain bg-gray-50 p-2 rounded-lg";
    img.src = item.image;
    img.alt = item.name;

    const div2 = document.createElement("div");
    div2.className =
        "flex flex-col text-sm font-medium gap-1 sm:flex-1";

    const name = document.createElement("span");
    name.className = "font-semibold text-gray-900";
    name.textContent = item.name;

    const variant = document.createElement("span");
    variant.className = "text-gray-500 text-xs";
    variant.textContent = item.storage;

    const id = document.createElement("span");
    id.className = "text-[11px] text-gray-400 mt-1";
    id.textContent = item.id || "#25139526913984";

    div2.appendChild(name);
    div2.appendChild(variant);
    div2.appendChild(id);

    const actions = document.createElement("div");
    actions.className =
        "flex flex-wrap items-center gap-3 sm:ml-auto sm:mt-0 mt-3";

    const minus = document.createElement("span");
    minus.className =
        "text-lg cursor-pointer px-2 py-1 hover:bg-gray-100 rounded transition";
    minus.innerHTML = `<i class="fa-sharp fa-solid fa-minus fa-2xs"></i>`;

    minus.addEventListener("click", () => {
        if (item.quantity > 1) {
            item.quantity = (item.quantity || 1) - 1;
            qty.textContent = item.quantity;
            price.textContent = `$${item.unitPrice * item.quantity}`;

            cart = JSON.parse(localStorage.getItem("cart")) || [];

            const index = cart.findIndex(i => i.id === item.id);

            if (index !== -1) {
                cart[index].quantity = item.quantity;
                localStorage.setItem("cart", JSON.stringify(cart));
            }
        }
    });

    const qty = document.createElement("span");
    qty.className =
        "w-[38px] h-[30px] border border-gray-300 flex items-center justify-center text-sm rounded-md";
    qty.textContent = item.quantity || 1;

    const plus = document.createElement("span");
    plus.className =
        "text-lg cursor-pointer px-2 py-1 hover:bg-gray-100 rounded transition";
    plus.innerHTML = `<i class="fa-sharp fa-solid fa-plus fa-2xs"></i>`;

    plus.addEventListener("click", () => {
        item.quantity = (item.quantity || 1) + 1;
        qty.textContent = item.quantity;

        console.log(item.unitPrice)

        price.textContent = `$${item.unitPrice * item.quantity}`;

        cart = JSON.parse(localStorage.getItem("cart")) || [];

        const index = cart.findIndex(i => i.id === item.id);

        if (index !== -1) {
            cart[index].quantity = item.quantity;
            localStorage.setItem("cart", JSON.stringify(cart));
        }
    });

    const price = document.createElement("span");
    price.className = "ml-2 sm:ml-4 font-semibold text-sm";
    price.textContent = `$${item.unitPrice * (item.quantity || 1)}`;

    const remove = document.createElement("span");
    remove.className =
        "ml-2 sm:ml-4 cursor-pointer text-gray-400 hover:text-red-500 transition";
    remove.innerHTML = `<i class="fa-sharp fa-solid fa-xmark fa-2xs"></i>`;

    remove.addEventListener("click", () => {
        const id = item.id;

        div.remove();

        cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart = cart.filter(product => product.id !== id);

        localStorage.setItem("cart", JSON.stringify(cart));

        updateEmptyState();
    });

    actions.appendChild(minus);
    actions.appendChild(qty);
    actions.appendChild(plus);
    actions.appendChild(price);
    actions.appendChild(remove);

    div.appendChild(img);
    div.appendChild(div2);
    div.appendChild(actions);

    cartContainer.appendChild(div);
});