const wishlistContainer = document.getElementById("cart");
const container = document.getElementById("container");
const emptyCartMsg = document.getElementById("emptyCartMsg");
const miniCart = document.getElementById("miniCart");
const miniCartImg = document.getElementById("miniCartImg");
const miniCartName = document.getElementById("miniCartName");
const miniCartVariant = document.getElementById("miniCartVariant");
const miniCartPrice = document.getElementById("miniCartPrice");
const closeMiniCart = document.getElementById("closeMiniCart");
const goToCartFromMini = document.getElementById("goToCartFromMini");

let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
let selectedWishlistIds = new Set();
let selectionMode = false;

function saveWishlist() {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

function updateEmptyState() {
    if (wishlist.length === 0) {
        emptyCartMsg.classList.remove("hidden");
        container.classList.add("hidden");
    } else {
        emptyCartMsg.classList.add("hidden");
        container.classList.remove("hidden");
    }
}

function formatPrice(price) {
    const value = Number(price) || 0;
    return Number.isInteger(value) ? `$${value}` : `$${value.toFixed(2)}`;
}

function removeWishlistItem(id, card) {
    wishlist = wishlist.filter(item => item.id !== id);
    selectedWishlistIds.delete(String(id));
    saveWishlist();
    card.remove();
    renderWishlist();
}

function addItemsToCart(items) {
    if (items.length === 0) return false;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItems = items.filter(item =>
        cart.some(cartItem => String(cartItem.id) === String(item.id))
    );

    if (existingItems.length > 0) {
        const names = existingItems.map(item => item.name).join(", ");
        const confirmed = window.confirm(
            `${names} already ${existingItems.length === 1 ? "exists" : "exist"} in the cart. Increase ${existingItems.length === 1 ? "its" : "their"} quantity?`
        );

        if (!confirmed) return false;
    }

    items.forEach(item => {
        const existingItem = cart.find(cartItem => String(cartItem.id) === String(item.id));

        if (existingItem) {
            existingItem.quantity = (Number(existingItem.quantity) || 1) + 1;
        } else {
            cart.push({ ...item, quantity: 1 });
        }
    });

    localStorage.setItem("cart", JSON.stringify(cart));
    return true;
}

function showMiniCart(items) {
    if (!miniCart || items.length === 0) return;

    const firstItem = items[0];
    const totalPrice = items.reduce((sum, item) => sum + (Number(item.unitPrice) || 0), 0);

    miniCartImg.src = firstItem.image;
    miniCartImg.alt = firstItem.name;
    miniCartName.textContent = firstItem.name;
    miniCartVariant.textContent = items.length > 1 ? `and ${items.length - 1} more item${items.length > 2 ? "s" : ""}` : (firstItem.storage || "");
    miniCartPrice.textContent = formatPrice(totalPrice);

    miniCart.classList.remove("hidden");

    setTimeout(() => {
        miniCart.classList.remove("opacity-0", "translate-y-5");
    }, 10);

    clearTimeout(miniCart.hideTimeout);

    miniCart.hideTimeout = setTimeout(() => {
        hideMiniCart();
    }, 5000);
}

function hideMiniCart() {
    if (!miniCart) return;

    miniCart.classList.add("opacity-0", "translate-y-5");

    setTimeout(() => {
        miniCart.classList.add("hidden");
    }, 300);
}

function getSelectedWishlistItems() {
    return wishlist.filter(item => selectedWishlistIds.has(String(item.id)));
}

function clearSelection() {
    selectedWishlistIds.clear();
    selectionMode = false;
    renderWishlist();
}

function deleteSelectedItems() {
    const selectedItems = getSelectedWishlistItems();

    if (selectedItems.length === 0) return;

    const confirmed = window.confirm(
        `Delete ${selectedItems.length} selected item${selectedItems.length === 1 ? "" : "s"} from your wishlist?`
    );

    if (!confirmed) return;

    wishlist = wishlist.filter(item => !selectedWishlistIds.has(String(item.id)));
    selectedWishlistIds.clear();
    selectionMode = false;
    saveWishlist();
    renderWishlist();
}

function createWishlistCard(item) {
    const card = document.createElement("div");
    card.dataset.id = item.id;
    card.className =
        "w-full min-w-0 p-4 gap-4 rounded-lg bg-[#F6F6F6] flex flex-col items-center relative";

    let selectBox = null;

    if (selectionMode) {
        selectBox = document.createElement("input");
        selectBox.type = "checkbox";
        selectBox.className =
            "absolute top-3 left-3 h-4 w-4 cursor-pointer accent-black";
        selectBox.setAttribute("aria-label", `Select ${item.name}`);
        selectBox.checked = selectedWishlistIds.has(String(item.id));

        selectBox.addEventListener("change", () => {
            if (selectBox.checked) {
                selectedWishlistIds.add(String(item.id));
            } else {
                selectedWishlistIds.delete(String(item.id));
            }

            renderWishlist();
        });
    }

    const removeButton = document.createElement("button");
    removeButton.className =
        "absolute top-2 right-2 h-8 w-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-white hover:text-red-500 transition-colors";
    removeButton.setAttribute("aria-label", `Remove ${item.name} from wishlist`);
    removeButton.innerHTML = `<i class="fa-sharp fa-solid fa-xmark"></i>`;

    removeButton.addEventListener("click", () => {
        removeWishlistItem(item.id, card);
    });

    const imageWrap = document.createElement("div");
    imageWrap.className =
        "w-full aspect-square max-w-[140px] lg:max-w-[160px] flex items-center justify-center";

    const image = document.createElement("img");
    image.className = "max-w-full max-h-full object-contain";
    image.src = item.image;
    image.alt = item.name;

    imageWrap.appendChild(image);

    const details = document.createElement("div");
    details.className = "flex flex-col gap-3 w-full text-center";

    const name = document.createElement("p");
    name.className = "font-['Inter'] font-medium text-sm leading-5 line-clamp-2";
    name.textContent = item.name;

    const price = document.createElement("p");
    price.className = "font-['Inter'] font-semibold text-2xl leading-6 tracking-[0.03em]";
    price.textContent = formatPrice(item.unitPrice);

    const link = document.createElement("button");
    link.className =
        "w-full h-12 flex items-center justify-center text-base rounded-lg bg-black text-white hover:bg-white hover:text-black transition-colors duration-300 border border-black";
    link.textContent = "Add to Cart";
    link.addEventListener("click", () => {
        if (addItemsToCart([item])) {
            showMiniCart([item]);
        }
    });

    details.appendChild(name);
    details.appendChild(price);
    details.appendChild(link);

    if (selectBox) {
        card.appendChild(selectBox);
    }

    card.appendChild(removeButton);
    card.appendChild(imageWrap);
    card.appendChild(details);

    return card;
}

function createBulkActions() {
    const selectedCount = selectedWishlistIds.size;
    const allSelected = wishlist.length > 0 && selectedCount === wishlist.length;

    const actions = document.createElement("div");
    actions.className =
        "mt-5 flex w-full max-w-[1120px] flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between";

    const selectWrap = document.createElement("label");
    selectWrap.className = "flex items-center gap-3 text-sm font-medium text-gray-800";

    const selectAll = document.createElement("input");
    selectAll.type = "checkbox";
    selectAll.className = "h-4 w-4 cursor-pointer accent-black";
    selectAll.checked = selectionMode && allSelected;
    selectAll.indeterminate = selectionMode && selectedCount > 0 && !allSelected;

    selectAll.addEventListener("change", () => {
        if (selectAll.checked) {
            selectionMode = true;
            selectedWishlistIds = new Set(wishlist.map(item => String(item.id)));
        } else {
            selectionMode = false;
            selectedWishlistIds.clear();
        }

        renderWishlist();
    });

    const selectText = document.createElement("span");
    selectText.textContent = selectionMode && selectedCount > 0 ? `${selectedCount} selected` : "Select all";

    selectWrap.appendChild(selectAll);
    selectWrap.appendChild(selectText);

    const buttonGroup = document.createElement("div");
    buttonGroup.className = "flex flex-wrap gap-2";

    const addSelected = document.createElement("button");
    addSelected.className =
        "rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40";
    addSelected.textContent = "Add to Cart";
    addSelected.disabled = selectedCount === 0;
    addSelected.classList.toggle("hidden", !selectionMode);
    addSelected.addEventListener("click", () => {
        const selectedItems = getSelectedWishlistItems();

        const confirmed = window.confirm(
            `Add ${selectedItems.length} selected item${selectedItems.length === 1 ? "" : "s"} to your cart?`
        );

        if (!confirmed) return;

        if (addItemsToCart(selectedItems)) {
            clearSelection();
            showMiniCart(selectedItems);
        }
    });

    const deleteSelected = document.createElement("button");
    deleteSelected.className =
        "rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40";
    deleteSelected.textContent = "Delete";
    deleteSelected.disabled = selectedCount === 0;
    deleteSelected.classList.toggle("hidden", !selectionMode);
    deleteSelected.addEventListener("click", deleteSelectedItems);

    const cancelSelected = document.createElement("button");
    cancelSelected.className =
        "rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40";
    cancelSelected.textContent = "Cancel";
    cancelSelected.disabled = selectedCount === 0;
    cancelSelected.classList.toggle("hidden", !selectionMode);
    cancelSelected.addEventListener("click", clearSelection);

    buttonGroup.appendChild(addSelected);
    buttonGroup.appendChild(deleteSelected);
    buttonGroup.appendChild(cancelSelected);

    actions.appendChild(selectWrap);
    actions.appendChild(buttonGroup);

    return actions;
}

function renderWishlist() {
    updateEmptyState();

    if (wishlist.length === 0) return;

    selectedWishlistIds = new Set(
        [...selectedWishlistIds].filter(id => wishlist.some(item => String(item.id) === id))
    );

    const title = wishlistContainer.querySelector("span");
    wishlistContainer.innerHTML = "";

    if (title) {
        wishlistContainer.appendChild(title);
    }

    wishlistContainer.appendChild(createBulkActions());

    const grid = document.createElement("div");
    grid.className = "w-full max-w-[1120px] mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4";

    wishlist.forEach(item => {
        grid.appendChild(createWishlistCard(item));
    });

    wishlistContainer.className = "cart w-full flex-1 h-fit mb-30 font-inter";
    wishlistContainer.appendChild(grid);
}

renderWishlist();

if (closeMiniCart) {
    closeMiniCart.addEventListener("click", hideMiniCart);
}

if (goToCartFromMini) {
    goToCartFromMini.addEventListener("click", () => {
        window.location.href = "shopping cart.html";
    });
}
