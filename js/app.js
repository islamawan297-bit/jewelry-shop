/**
 * Jewelry Brand Global Application Script (Cart, Search, Navigation, Shared UI)
 */

(function () {
    // --- CART STATE MANAGEMENT ---
    const CART_KEY = "jewelry_cart";
    const COUPON_KEY = "jewelry_active_coupon";

    // Valid discount coupons
    const VALID_COUPONS = {
        "GOLD10": { type: "percent", value: 10 },
        "LUXURY20": { type: "percent", value: 20 },
        "FREESHIP": { type: "fixed", value: 15 } // Subtracts shipping charge
    };

    window.CartAPI = {
        getCart: function () {
            return JSON.parse(localStorage.getItem(CART_KEY)) || [];
        },
        saveCart: function (cart) {
            localStorage.setItem(CART_KEY, JSON.stringify(cart));
            // Trigger cart update event across pages
            document.dispatchEvent(new CustomEvent("cartUpdated"));
            this.updateBadge();
        },
        addToCart: function (productId, qty, metal, size) {
            const product = window.JewelryDB.getProductById(productId);
            if (!product) return false;

            let cart = this.getCart();
            const existingIndex = cart.findIndex(
                item => item.id === productId && item.metal === metal && item.size === size
            );

            const itemPrice = product.isSale ? product.price : product.price; // Or parse discount if needed
            
            if (existingIndex !== -1) {
                cart[existingIndex].quantity += parseInt(qty);
            } else {
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: itemPrice,
                    quantity: parseInt(qty),
                    metal: metal || product.metals[0] || "Standard",
                    size: size || product.sizes[0] || "Standard",
                    image: product.images[0]
                });
            }

            this.saveCart(cart);
            window.AppUI.showToast(`${product.name} added to cart!`, "success");
            return true;
        },
        updateQty: function (id, metal, size, quantity) {
            let cart = this.getCart();
            const index = cart.findIndex(
                item => item.id === id && item.metal === metal && item.size === size
            );

            if (index !== -1) {
                if (quantity <= 0) {
                    cart.splice(index, 1);
                } else {
                    cart[index].quantity = parseInt(quantity);
                }
                this.saveCart(cart);
            }
        },
        removeFromCart: function (id, metal, size) {
            let cart = this.getCart();
            cart = cart.filter(
                item => !(item.id === id && item.metal === metal && item.size === size)
            );
            this.saveCart(cart);
            window.AppUI.showToast("Item removed from cart.", "info");
        },
        clearCart: function () {
            localStorage.removeItem(CART_KEY);
            localStorage.removeItem(COUPON_KEY);
            document.dispatchEvent(new CustomEvent("cartUpdated"));
            this.updateBadge();
        },
        getCartCount: function () {
            return this.getCart().reduce((sum, item) => sum + item.quantity, 0);
        },
        getSubtotal: function () {
            return this.getCart().reduce((sum, item) => sum + (item.price * item.quantity), 0);
        },
        getCoupon: function () {
            const couponCode = localStorage.getItem(COUPON_KEY);
            if (couponCode && VALID_COUPONS[couponCode.toUpperCase()]) {
                return {
                    code: couponCode.toUpperCase(),
                    ...VALID_COUPONS[couponCode.toUpperCase()]
                };
            }
            return null;
        },
        applyCoupon: function (code) {
            const cleanCode = code.trim().toUpperCase();
            if (VALID_COUPONS[cleanCode]) {
                localStorage.setItem(COUPON_KEY, cleanCode);
                document.dispatchEvent(new CustomEvent("cartUpdated"));
                return { success: true, message: `Coupon '${cleanCode}' applied successfully!` };
            }
            return { success: false, message: "Invalid coupon code." };
        },
        removeCoupon: function () {
            localStorage.removeItem(COUPON_KEY);
            document.dispatchEvent(new CustomEvent("cartUpdated"));
        },
        getDiscount: function () {
            const coupon = this.getCoupon();
            if (!coupon) return 0;

            const subtotal = this.getSubtotal();
            if (coupon.type === "percent") {
                return parseFloat((subtotal * (coupon.value / 100)).toFixed(2));
            } else if (coupon.type === "fixed") {
                return coupon.value; // Shipping discount or flat rate
            }
            return 0;
        },
        getShipping: function () {
            const subtotal = this.getSubtotal();
            if (subtotal === 0 || subtotal > 1500) return 0; // Free shipping over 1500
            
            const coupon = this.getCoupon();
            if (coupon && coupon.code === "FREESHIP") return 0;
            
            return 15; // Flat $15 shipping rate
        },
        getTotal: function () {
            const subtotal = this.getSubtotal();
            const discount = this.getDiscount();
            const shipping = this.getShipping();
            return Math.max(0, subtotal - discount + shipping);
        },
        updateBadge: function () {
            const badges = document.querySelectorAll(".cart-badge");
            const count = this.getCartCount();
            badges.forEach(badge => {
                badge.textContent = count;
                badge.style.display = count > 0 ? "flex" : "none";
            });
        }
    };

    // --- UI HELPERS & OVERLAYS ---
    window.AppUI = {
        showToast: function (message, type = "success") {
            let container = document.querySelector(".toast-container");
            if (!container) {
                container = document.createElement("div");
                container.className = "toast-container";
                document.body.appendChild(container);
            }

            const toast = document.createElement("div");
            toast.className = `toast ${type}`;
            
            let icon = "fa-circle-check";
            if (type === "error") icon = "fa-circle-xmark";
            if (type === "info") icon = "fa-circle-info";

            toast.innerHTML = `
                <i class="fa-solid ${icon}"></i>
                <span>${message}</span>
            `;

            container.appendChild(toast);

            // Remove toast after duration
            setTimeout(() => {
                toast.classList.add("removing");
                toast.addEventListener("animationend", () => {
                    toast.remove();
                });
            }, 3000);
        },
        renderCartDrawer: function () {
            const cartBody = document.querySelector(".cart-drawer-body");
            const cartItemsCount = document.getElementById("cart-drawer-count");
            const subtotalEl = document.getElementById("cart-drawer-subtotal");
            const totalEl = document.getElementById("cart-drawer-total");
            const discountEl = document.getElementById("cart-drawer-discount");
            const discountRow = document.getElementById("cart-drawer-discount-row");
            const shippingEl = document.getElementById("cart-drawer-shipping");
            
            if (!cartBody) return;

            const cart = window.CartAPI.getCart();
            cartItemsCount.textContent = `(${window.CartAPI.getCartCount()} items)`;

            if (cart.length === 0) {
                cartBody.innerHTML = `
                    <div class="cart-empty-message">
                        <i class="fa-solid fa-bag-shopping" style="font-size: 2.5rem; color: var(--color-border); margin-bottom: 1rem;"></i>
                        <p>Your jewelry chest is empty.</p>
                        <a href="shop.html" class="btn-gold" style="margin-top: 1.5rem; display: inline-block;">Continue Shopping</a>
                    </div>
                `;
                subtotalEl.textContent = "$0.00";
                shippingEl.textContent = "$0.00";
                totalEl.textContent = "$0.00";
                if (discountRow) discountRow.style.display = "none";
                return;
            }

            cartBody.innerHTML = cart.map(item => `
                <div class="cart-drawer-item" data-id="${item.id}" data-metal="${item.metal}" data-size="${item.size}">
                    <img src="${item.image}" alt="${item.name}" class="cart-drawer-item-img">
                    <div class="cart-drawer-item-details">
                        <h4 class="cart-drawer-item-name">${item.name}</h4>
                        <div class="cart-drawer-item-meta">${item.metal} / ${item.size}</div>
                        <div class="cart-drawer-item-qty">
                            <button class="qty-btn dec-qty-btn" onclick="CartAPI.updateQty('${item.id}', '${item.metal}', '${item.size}', ${item.quantity - 1})">-</button>
                            <span class="qty-num">${item.quantity}</span>
                            <button class="qty-btn inc-qty-btn" onclick="CartAPI.updateQty('${item.id}', '${item.metal}', '${item.size}', ${item.quantity + 1})">+</button>
                        </div>
                    </div>
                    <div class="cart-drawer-item-price">
                        <span>$${(item.price * item.quantity).toLocaleString()}</span>
                        <button class="cart-item-remove" onclick="CartAPI.removeFromCart('${item.id}', '${item.metal}', '${item.size}')">
                            <i class="fa-regular fa-trash-can"></i>
                        </button>
                    </div>
                </div>
            `).join("");

            // Summary Math
            subtotalEl.textContent = `$${window.CartAPI.getSubtotal().toLocaleString()}`;
            shippingEl.textContent = window.CartAPI.getShipping() === 0 ? "FREE" : `$${window.CartAPI.getShipping().toFixed(2)}`;
            
            const discount = window.CartAPI.getDiscount();
            if (discount > 0 && discountRow) {
                discountRow.style.display = "flex";
                discountEl.textContent = `-$${discount.toLocaleString()}`;
            } else if (discountRow) {
                discountRow.style.display = "none";
            }
            
            totalEl.textContent = `$${window.CartAPI.getTotal().toLocaleString()}`;
        }
    };

    // --- DOM CONTENT INITIALIZATION ---
    document.addEventListener("DOMContentLoaded", () => {
        // Render FontAwesome dynamically if not already linked (just in case)
        if (!document.querySelector('link[href*="font-awesome"]')) {
            const faLink = document.createElement("link");
            faLink.rel = "stylesheet";
            faLink.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
            document.head.appendChild(faLink);
        }

        // Initialize Cart Badges
        window.CartAPI.updateBadge();

        // Mobile Menu Setup
        const menuToggle = document.querySelector(".mobile-nav-toggle");
        if (menuToggle) {
            // Create Drawer Overlay dynamically
            const menuOverlay = document.createElement("div");
            menuOverlay.className = "mobile-menu-overlay";
            menuOverlay.innerHTML = `
                <div class="mobile-menu-drawer">
                    <button class="mobile-menu-close"><i class="fa-solid fa-xmark"></i></button>
                    <div class="logo" style="margin-top: 1rem;"><a href="index.html">AURUM<span>.</span></a></div>
                    <nav class="mobile-nav-links">
                        <a href="index.html">Home</a>
                        <a href="shop.html">Collections</a>
                        <a href="about.html">About Us</a>
                        <a href="admin.html">Admin Portal</a>
                    </nav>
                </div>
            `;
            document.body.appendChild(menuOverlay);

            menuToggle.addEventListener("click", () => {
                menuOverlay.classList.add("active");
            });

            menuOverlay.querySelector(".mobile-menu-close").addEventListener("click", () => {
                menuOverlay.classList.remove("active");
            });

            menuOverlay.addEventListener("click", (e) => {
                if (e.target === menuOverlay) {
                    menuOverlay.classList.remove("active");
                }
            });
        }

        // Search Bar Toggle Setup
        const searchToggle = document.getElementById("search-toggle");
        const searchContainer = document.getElementById("search-container");
        if (searchToggle && searchContainer) {
            searchToggle.addEventListener("click", () => {
                const isVisible = searchContainer.style.display === "block";
                searchContainer.style.display = isVisible ? "none" : "block";
                if (!isVisible) {
                    document.getElementById("search-input").focus();
                }
            });

            document.getElementById("search-close").addEventListener("click", () => {
                searchContainer.style.display = "none";
            });

            // Handle Search Submit
            const searchInput = document.getElementById("search-input");
            searchInput.addEventListener("keypress", (e) => {
                if (e.key === "Enter" && searchInput.value.trim() !== "") {
                    window.location.href = `shop.html?search=${encodeURIComponent(searchInput.value.trim())}`;
                }
            });
        }

        // Cart Drawer Setup
        const cartToggle = document.getElementById("cart-toggle");
        if (cartToggle) {
            // Create Drawer HTML Overlay dynamically if not present
            let cartDrawerOverlay = document.querySelector(".cart-drawer-overlay");
            if (!cartDrawerOverlay) {
                cartDrawerOverlay = document.createElement("div");
                cartDrawerOverlay.className = "cart-drawer-overlay";
                cartDrawerOverlay.innerHTML = `
                    <div class="cart-drawer">
                        <div class="cart-drawer-header">
                            <h3 style="font-family: var(--font-serif); font-size: 1.25rem;">Shopping Bag <span id="cart-drawer-count">(0)</span></h3>
                            <button class="cart-drawer-close"><i class="fa-solid fa-xmark"></i></button>
                        </div>
                        <div class="cart-drawer-body">
                            <!-- Items populated dynamically -->
                        </div>
                        <div class="cart-drawer-footer">
                            <div class="cart-drawer-summary-row">
                                <span>Subtotal</span>
                                <span id="cart-drawer-subtotal">$0.00</span>
                            </div>
                            <div class="cart-drawer-summary-row" id="cart-drawer-discount-row" style="display: none; color: green;">
                                <span>Discount</span>
                                <span id="cart-drawer-discount">-$0.00</span>
                            </div>
                            <div class="cart-drawer-summary-row">
                                <span>Shipping</span>
                                <span id="cart-drawer-shipping">FREE</span>
                            </div>
                            <div class="cart-drawer-summary-row total">
                                <span>Total</span>
                                <span id="cart-drawer-total">$0.00</span>
                            </div>
                            <a href="cart.html" class="btn-gold cart-drawer-checkout-btn">View Full Cart</a>
                        </div>
                    </div>
                `;
                document.body.appendChild(cartDrawerOverlay);
            }

            cartToggle.addEventListener("click", () => {
                cartDrawerOverlay.classList.add("active");
                window.AppUI.renderCartDrawer();
            });

            cartDrawerOverlay.querySelector(".cart-drawer-close").addEventListener("click", () => {
                cartDrawerOverlay.classList.remove("active");
            });

            cartDrawerOverlay.addEventListener("click", (e) => {
                if (e.target === cartDrawerOverlay) {
                    cartDrawerOverlay.classList.remove("active");
                }
            });

            // Listen for local storage cart updates to re-render drawer if open
            document.addEventListener("cartUpdated", () => {
                if (cartDrawerOverlay.classList.contains("active")) {
                    window.AppUI.renderCartDrawer();
                }
            });
        }

        // Highlight Active Link
        const currentPath = window.location.pathname.split("/").pop() || "index.html";
        const navLinks = document.querySelectorAll(".nav-link");
        navLinks.forEach(link => {
            const href = link.getAttribute("href");
            if (href === currentPath) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });
    });
})();
