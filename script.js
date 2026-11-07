
// ShopZone JavaScript

let products = [];
let cart = [];

// HTML Elements
const productContainer = document.getElementById("productContainer");
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartOverlay = document.getElementById("cartOverlay");
const searchInput = document.getElementById("searchInput");

// Fetch Products from JSON File
async function loadProducts() {
    try {
        const response = await fetch("products.json");

        if (!response.ok) {
            throw new Error("Unable to load products");
        }

        products = await response.json();
        displayProducts(products);

    } catch (error) {
        productContainer.innerHTML =
            "<p>Products could not be loaded. Please run the project using a local server.</p>";

        console.error(error);
    }
}

// Display Products
function displayProducts(items) {
    productContainer.innerHTML = "";

    if (items.length === 0) {
        productContainer.innerHTML = "<p>No products found.</p>";
        return;
    }

    items.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";

        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="category">${product.category}</p>
                <p class="rating">⭐ ${product.rating}/5</p>
                <p class="price">₹${product.price.toLocaleString("en-IN")}</p>
                <button class="add-cart">Add to Cart</button>
            </div>
        `;

        card.querySelector(".add-cart").addEventListener("click", () => {
            addToCart(product.id);
        });

        productContainer.appendChild(card);
    });
}

// Add Product to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);

    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCart();
}

// Update Cart
function updateCart() {
    cartItems.innerHTML = "";

    let total = 0;
    let count = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        count += item.quantity;

        const div = document.createElement("div");
        div.className = "cart-item";

        const name = document.createElement("span");
        name.textContent = `${item.name} x ${item.quantity}`;

        const price = document.createElement("strong");
        price.textContent = "₹" +
            (item.price * item.quantity).toLocaleString("en-IN");

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";

        removeBtn.addEventListener("click", () => {
            removeFromCart(item.id);
        });

        div.append(name, price, removeBtn);
        cartItems.appendChild(div);
    });

    cartCount.textContent = count;
    cartTotal.textContent = total.toLocaleString("en-IN");

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Your cart is empty.</p>";
    }
}

// Remove Product from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Category Filtering
document.querySelectorAll(".filter-btn").forEach(button => {
    button.addEventListener("click", () => {

        document.querySelectorAll(".filter-btn").forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        const category = button.dataset.category;

        const filtered = category === "All"
            ? products
            : products.filter(product =>
                product.category === category
            );

        displayProducts(filtered);
    });
});

// Search Products
function searchProducts() {
    const keyword = searchInput.value.toLowerCase().trim();

    const filtered = products.filter(product =>
        product.name.toLowerCase().includes(keyword) ||
        product.category.toLowerCase().includes(keyword)
    );

    displayProducts(filtered);

    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.classList.remove("active");
    });
}

document.getElementById("searchBtn")
    .addEventListener("click", searchProducts);

searchInput.addEventListener("input", searchProducts);

// Open and Close Cart
document.getElementById("cartBtn").addEventListener("click", () => {
    cartOverlay.classList.add("show");
});

document.getElementById("closeCart").addEventListener("click", () => {
    cartOverlay.classList.remove("show");
});

// Close cart when clicking outside
cartOverlay.addEventListener("click", event => {
    if (event.target === cartOverlay) {
        cartOverlay.classList.remove("show");
    }
});

// Checkout
document.getElementById("checkoutBtn").addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    alert("Thank you for shopping with ShopZone!");

    cart = [];
    updateCart();
    cartOverlay.classList.remove("show");
});

// Load products when page starts
loadProducts();
