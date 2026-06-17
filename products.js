const cartBtn = document.getElementById("cartBtn")
let selectedPrice = 1399;
let selectedStorage = "1TB";
let device_name = document.getElementById("phoneName").textContent;
let productImage = document.getElementById("main_image").src;
const goToCartBtn = document.getElementById("goToCartBtn");

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
    });
});

// hearts
const heartButtons = document.querySelectorAll('.wishlist-heart');

heartButtons.forEach(heart => {
    heart.addEventListener('click', function (e) {
        if (this.tagName === 'A') e.preventDefault();

        this.classList.remove('pop');
        void this.offsetWidth;
        this.classList.add('pop');
        this.classList.toggle('is-liked');

        const icon = this.querySelector('i.fa-heart');
        if (icon) {
            const liked = this.classList.contains('is-liked');
            icon.classList.toggle('fa-regular', !liked);
            icon.classList.toggle('fa-solid', liked);
        }
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
        id: Date.now(),
        name: device_name,
        storage: selectedStorage,
        unitPrice: selectedPrice,
        image: productImage,
        quantity: 1
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(cartItem);

    localStorage.setItem('cart', JSON.stringify(cart));

    showMiniCart(cartItem);
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