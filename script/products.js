const cartBtn = document.getElementById("cartBtn")
let selectedPrice = 1399;
let selectedStorage = "1TB";
let device_name = document.getElementById("phoneName").textContent;
let productImage = document.getElementById("main_image").src;
const goToCartBtn = document.getElementById("goToCartBtn");

function makeCartItemId(name, storage) {
    return `${name}-${storage}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function makeWishlistItemId(name, storage = "") {
    return `wishlist-${name}-${storage}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function findMatchingCartItem(cart, item) {
    return cart.find(cartItem =>
        String(cartItem.id) === String(item.id) ||
        (cartItem.name === item.name && cartItem.storage === item.storage)
    );
}

function getWishlist() {
    return JSON.parse(localStorage.getItem("wishlist")) || [];
}

function setWishlist(wishlist) {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

function getMainProductItem() {
    const currentImage = document.getElementById("expandedImg")?.src || productImage;

    return {
        id: makeWishlistItemId(device_name, selectedStorage),
        name: device_name,
        storage: selectedStorage,
        unitPrice: selectedPrice,
        image: currentImage,
        quantity: 1
    };
}

function getRelatedProductItem(card, index) {
    const name = card.querySelector("h3")?.textContent.trim().replace(/\s+/g, " ") || `Product ${index + 1}`;
    const variant = card.querySelector("p.text-sm.text-gray-500")?.textContent.trim() || "";
    const priceText = [...card.querySelectorAll("p")].map(p => p.textContent).find(text => text.includes("$")) || "0";
    const image = card.querySelector("img")?.src || "";
    const fullName = variant ? `${name} ${variant}` : name;

    return {
        id: makeWishlistItemId(fullName),
        name: fullName,
        unitPrice: Number(priceText.replace(/[^0-9.]/g, "")) || 0,
        image,
        quantity: 1
    };
}

function saveWishlistItem(item) {
    const wishlist = getWishlist();
    const exists = wishlist.some(product => String(product.id) === String(item.id));

    if (!exists) {
        wishlist.push(item);
        setWishlist(wishlist);
    }
}

function removeWishlistItemById(id) {
    setWishlist(getWishlist().filter(product => String(product.id) !== String(id)));
}

function isWishlistItemSaved(id) {
    return getWishlist().some(product => String(product.id) === String(id));
}

function updateMainWishlistButtonState() {
    const button = document.querySelector(".action-buttons button");

    if (!button) return;

    button.textContent = isWishlistItemSaved(getMainProductItem().id) ? "Added to Wishlist" : "Add to Wishlist";
}

function playWishlistButtonFeedback(button, liked) {
    const finalText = liked ? "Added to Wishlist" : "Add to Wishlist";
    const feedbackText = liked ? "Added!" : "Removed";

    button.disabled = true;
    button.textContent = feedbackText;
    button.style.backgroundColor = liked ? "#000000" : "#f3f4f6";
    button.style.color = liked ? "#ffffff" : "#111827";

    const finish = () => {
        button.disabled = false;
        button.textContent = finalText;
        button.style.backgroundColor = "";
        button.style.color = "";
        button.style.transform = "";
    };

    if (!button.animate) {
        setTimeout(finish, 500);
        return;
    }

    const animation = button.animate(
        [
            { transform: "scale(1)" },
            { transform: "scale(1.04)" },
            { transform: "scale(1)" }
        ],
        {
            duration: 520,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)"
        }
    );

    animation.addEventListener("finish", finish, { once: true });
}

//thumbnail
function myFunction(imgs) {
    var expandImg = document.getElementById("expandedImg");
    expandImg.src = imgs.src;
    expandImg.parentElement.style.display = "flex";

    var thumbnails = document.querySelectorAll(".column img");
    thumbnails.forEach(img => {
        img.classList.remove("active", "opacity-100", "border-blue-500");
        img.classList.add("opacity-50", "border-transparent");
    });

    imgs.classList.remove("opacity-50", "border-transparent");
    imgs.classList.add("active", "opacity-100", "border-blue-500");
}

//change price on click
const storageButtons = document.querySelectorAll('.storage-btn');
const currentPriceEl = document.getElementById('currentPrice');
const originalPriceEl = document.getElementById('originalPrice');

const originalPrices = {
    '128GB': 1199,
    '256GB': 1299,
    '512GB': 1399,
    '1TB': 1499
};

storageButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active state from all buttons
        storageButtons.forEach(btn => {
            btn.classList.remove('border-2', 'border-black', 'font-semibold', 'bg-white', 'active');
            btn.classList.add('border', 'border-gray-300', 'text-gray-500');
        });

        // Add active state to clicked button
        button.classList.remove('border', 'border-gray-300', 'text-gray-500');
        button.classList.add('border-2', 'border-black', 'font-semibold', 'bg-white', 'active');

        // Update prices - FIX: use parseInt on dataset.price (just the number)
        const newPrice = parseInt(button.dataset.price);
        const storage = button.dataset.storage;
        const newOriginalPrice = originalPrices[storage];

        currentPriceEl.textContent = newPrice;
        originalPriceEl.textContent = newOriginalPrice;

        //store selected price
        selectedPrice = newPrice;
        selectedStorage = storage;
        updateMainWishlistButtonState();
    });
});

// main product wishlist button
const mainWishlistButton = document.querySelector(".action-buttons button");

if (mainWishlistButton) {
    mainWishlistButton.removeAttribute("onclick");
    updateMainWishlistButtonState();

    mainWishlistButton.addEventListener("click", () => {
        const item = getMainProductItem();
        const liked = !isWishlistItemSaved(item.id);

        if (liked) {
            saveWishlistItem(item);
        } else {
            removeWishlistItemById(item.id);
        }

        playWishlistButtonFeedback(mainWishlistButton, liked);
    });
}

// related product hearts
const heartButtons = document.querySelectorAll('.wishlist-heart');

heartButtons.forEach((heart, index) => {
    const card = heart.closest(".grid > div");
    const item = card ? getRelatedProductItem(card, index) : null;

    const setHeartState = (liked) => {
        heart.classList.toggle('is-liked', liked);

        const icon = heart.querySelector('i.fa-heart');
        const svg = heart.querySelector('svg');

        if (icon) {
            icon.classList.toggle('fa-regular', !liked);
            icon.classList.toggle('fa-solid', liked);
        }

        if (svg) {
            svg.setAttribute("fill", liked ? "currentColor" : "none");
        }
    };

    if (item) {
        setHeartState(isWishlistItemSaved(item.id));
    }

    heart.addEventListener('click', function (e) {
        if (this.tagName === 'A') e.preventDefault();
        if (!item) return;

        this.classList.remove('pop');
        void this.offsetWidth;
        this.classList.add('pop');

        const liked = !isWishlistItemSaved(item.id);

        if (liked) {
            saveWishlistItem(item);
        } else {
            removeWishlistItemById(item.id);
        }

        setHeartState(liked);
    });

    heart.addEventListener('animationend', function () {
        this.classList.remove('pop');
    });
});

//view more
document.getElementById('viewMoreBtn').addEventListener('click', function () {
    const moreContent = document.getElementById('moreContent');
    const arrow = this.querySelector('svg');

    if (moreContent.classList.contains('hidden')) {
        moreContent.classList.remove('hidden');
        this.innerHTML = `View Less <svg class="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>`;
    } else {
        moreContent.classList.add('hidden');
        this.innerHTML = `View More <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>`;
    }
});

//add to cart
cartBtn.addEventListener("click", () => {
    const cartItem = {
        id: makeCartItemId(device_name, selectedStorage),
        name: device_name,
        storage: selectedStorage,
        unitPrice: selectedPrice,
        image: productImage,
        quantity: 1
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = findMatchingCartItem(cart, cartItem);

    if (existingItem) {
        const confirmed = window.confirm(
            `${cartItem.name} (${cartItem.storage}) already exists in the cart. Increase the quantity?`
        );

        if (!confirmed) return;

        existingItem.quantity = (Number(existingItem.quantity) || 1) + 1;
        existingItem.id = cartItem.id;
        existingItem.unitPrice = cartItem.unitPrice;
        existingItem.image = cartItem.image;
    } else {
        cart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    showMiniCart(existingItem || cartItem);
})

const miniCart = document.getElementById("miniCart");
const miniCartImg = document.getElementById("miniCartImg");
const miniCartName = document.getElementById("miniCartName");
const miniCartVariant = document.getElementById("miniCartVariant");
const miniCartPrice = document.getElementById("miniCartPrice");

const closeMiniCart = document.getElementById("closeMiniCart");
const goToCartFromMini = document.getElementById("goToCartFromMini");

function showMiniCart(item) {
    miniCartImg.src = item.image;
    miniCartName.textContent = item.name;
    miniCartVariant.textContent = item.storage;
    miniCartPrice.textContent = `$${item.unitPrice * item.quantity}`;

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
    miniCart.classList.add("opacity-0", "translate-y-5");

    setTimeout(() => {
        miniCart.classList.add("hidden");
    }, 300);
}

closeMiniCart.addEventListener("click", hideMiniCart);

goToCartFromMini.addEventListener("click", () => {
    window.location.href = "shopping cart.html";
});
