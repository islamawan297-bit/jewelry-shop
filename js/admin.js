/**
 * Jewelry Brand Admin Dashboard controller
 */

(function () {
    // Current Active Tab
    let activeTab = "dashboard";

    // Modals DOM
    const productModal = document.getElementById("product-form-modal");
    const orderModal = document.getElementById("order-details-modal");
    const crudForm = document.getElementById("product-crud-form");

    // Modal forms fields
    const fId = document.getElementById("crud-id");
    const fName = document.getElementById("crud-name");
    const fCategory = document.getElementById("crud-category");
    const fPrice = document.getElementById("crud-price");
    const fOriginalPrice = document.getElementById("crud-original-price");
    const fInStock = document.getElementById("crud-instock");
    const fDesc = document.getElementById("crud-desc");
    const fImages = document.getElementById("crud-images");
    const fMetals = document.getElementById("crud-metals");
    const fSizes = document.getElementById("crud-sizes");
    const fDetails = document.getElementById("crud-details");

    document.addEventListener("DOMContentLoaded", () => {
        // --- TAB ROUTING ---
        const navItems = document.querySelectorAll(".admin-nav-item");
        navItems.forEach(item => {
            item.addEventListener("click", () => {
                navItems.forEach(i => i.classList.remove("active"));
                item.classList.add("active");

                const target = item.getAttribute("data-tab");
                document.querySelectorAll(".admin-tab-content").forEach(c => c.classList.remove("active"));
                document.getElementById(`tab-${target}`).classList.add("active");

                activeTab = target;
                refreshActiveTab();
            });
        });

        // --- PRODUCT MODAL LISTENERS ---
        document.getElementById("admin-add-product-btn").onclick = () => {
            resetCrudForm();
            document.getElementById("product-modal-title").textContent = "Add New Jewelry Design";
            productModal.classList.add("active");
        };

        document.getElementById("product-modal-close").onclick = () => productModal.classList.remove("active");
        document.getElementById("product-modal-cancel").onclick = () => productModal.classList.remove("active");
        
        // --- ORDER MODAL LISTENERS ---
        document.getElementById("order-modal-close").onclick = () => orderModal.classList.remove("active");
        document.getElementById("order-modal-ok-btn").onclick = () => orderModal.classList.remove("active");

        // --- CRUD FORM SUBMISSION ---
        crudForm.addEventListener("submit", (e) => {
            e.preventDefault();
            saveCrudProduct();
        });

        // Initial Load
        refreshActiveTab();
    });

    // Main Refresh Trigger
    function refreshActiveTab() {
        // Sync cart updates or structural counts
        updateMetrics();

        if (activeTab === "dashboard") {
            renderDashboardRecentOrders();
        } else if (activeTab === "products") {
            renderProductsList();
        } else if (activeTab === "orders") {
            renderOrdersList();
        } else if (activeTab === "reviews") {
            renderReviewsList();
        }
    }

    // --- DASHBOARD METRICS CALCULATOR ---
    function updateMetrics() {
        const products = window.JewelryDB.getProducts();
        const orders = window.JewelryDB.getOrders();
        const reviews = window.JewelryDB.getReviews();

        // Calculate Revenue (Total from active orders, excluding Cancelled ones)
        const revenue = orders
            .filter(o => o.orderStatus !== "Cancelled")
            .reduce((sum, o) => sum + o.total, 0);

        document.getElementById("metric-revenue").textContent = `$${revenue.toLocaleString()}`;
        document.getElementById("metric-orders").textContent = orders.length;
        document.getElementById("metric-products").textContent = products.length;
        document.getElementById("metric-reviews").textContent = reviews.length;
    }

    // Dashboard Recent Orders table
    function renderDashboardRecentOrders() {
        const tbody = document.querySelector("#dashboard-recent-orders-table tbody");
        if (!tbody) return;

        const orders = window.JewelryDB.getOrders().slice(0, 5); // top 5

        if (orders.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--color-text-muted);">No sales orders recorded yet.</td></tr>`;
            return;
        }

        tbody.innerHTML = orders.map(o => `
            <tr>
                <td style="font-weight: 600;">${o.id}</td>
                <td>${o.customerName}</td>
                <td>${new Date(o.date).toLocaleDateString()}</td>
                <td style="font-weight: 500; color: var(--color-gold);">$${o.total.toLocaleString()}</td>
                <td><span class="status-badge ${o.orderStatus.toLowerCase()}">${o.orderStatus}</span></td>
            </tr>
        `).join("");
    }

    // --- PRODUCTS MANAGEMENT ---
    function renderProductsList() {
        const tbody = document.querySelector("#admin-products-table tbody");
        if (!tbody) return;

        const products = window.JewelryDB.getProducts();

        if (products.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--color-text-muted);">Inventory catalog empty.</td></tr>`;
            return;
        }

        tbody.innerHTML = products.map(p => `
            <tr>
                <td style="display: flex; align-items: center; gap: 1rem;">
                    <img src="${p.images[0]}" alt="${p.name}" style="width: 50px; height: 50px; object-fit: cover; border: 1px solid var(--color-border);">
                    <div>
                        <div style="font-weight: 500; color: var(--color-dark);">${p.name}</div>
                        <div style="font-size: 0.75rem; color: var(--color-text-muted);">Ref ID: ${p.id}</div>
                    </div>
                </td>
                <td>${p.category}</td>
                <td style="font-weight: 500;">$${p.price.toLocaleString()}</td>
                <td>
                    <span class="status-badge ${p.inStock ? 'delivered' : 'cancelled'}">
                        ${p.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                </td>
                <td style="text-align: right;">
                    <div class="admin-actions-cell" style="justify-content: flex-end;">
                        <button class="admin-btn edit" onclick="AdminPanel.editProduct('${p.id}')">Edit</button>
                        <button class="admin-btn delete" onclick="AdminPanel.deleteProduct('${p.id}')">Delete</button>
                    </div>
                </td>
            </tr>
        `).join("");
    }

    // Reset Form inputs
    function resetCrudForm() {
        fId.value = "";
        fName.value = "";
        fCategory.value = "Rings";
        fPrice.value = "";
        fOriginalPrice.value = "";
        fInStock.checked = true;
        fDesc.value = "";
        fImages.value = "";
        
        // Defaults
        fMetals.value = "18K Yellow Gold, 18K White Gold, 18K Rose Gold";
        fSizes.value = "5, 6, 7, 8, 9";
        fDetails.value = "Material: 18K Gold, Main Stone: Round Diamond, Carat: 0.75 TCW";
    }

    // Save/Update Submit click
    function saveCrudProduct() {
        const id = fId.value.trim();
        const name = fName.value.trim();
        const category = fCategory.value;
        const price = parseFloat(fPrice.value);
        const originalPrice = parseFloat(fOriginalPrice.value);
        const inStock = fInStock.checked;
        const desc = fDesc.value.trim();
        const imagesStr = fImages.value.trim();
        const metalsStr = fMetals.value.trim();
        const sizesStr = fSizes.value.trim();
        const specsStr = fDetails.value.trim();

        // Basic Validations
        if (!name || isNaN(price) || !desc || !imagesStr || !metalsStr || !sizesStr || !specsStr) {
            window.AppUI.showToast("Please fill all required fields correctly.", "error");
            return;
        }

        // Parse Arrays
        const images = imagesStr.split(",").map(url => url.trim()).filter(url => url !== "");
        const metals = metalsStr.split(",").map(val => val.trim()).filter(val => val !== "");
        const sizes = sizesStr.split(",").map(val => val.trim()).filter(val => val !== "");

        // Parse Details Specifications Table Object ("Material: 18K Gold, Stone: Diamond")
        const details = {};
        specsStr.split(",").forEach(pair => {
            const parts = pair.split(":");
            if (parts.length >= 2) {
                const key = parts[0].trim();
                const value = parts.slice(1).join(":").trim();
                details[key] = value;
            }
        });

        // Build Payload
        const productData = {
            name: name,
            category: category,
            price: price,
            inStock: inStock,
            description: desc,
            images: images,
            metals: metals,
            sizes: sizes,
            details: details
        };

        // Sale computation
        if (!isNaN(originalPrice) && originalPrice > price) {
            productData.originalPrice = originalPrice;
            productData.isSale = true;
        } else {
            productData.originalPrice = price;
            productData.isSale = false;
        }

        if (id) {
            // Edit Mode
            productData.id = id;
            window.JewelryDB.saveProduct(productData);
            window.AppUI.showToast("Product updated successfully!", "success");
        } else {
            // Add Mode
            const catPrefix = category.toLowerCase().slice(0, 4);
            productData.id = `${catPrefix}-${Date.now().toString().slice(-6)}`;
            productData.rating = 5.0; // Default new item rating
            productData.reviewCount = 0;
            productData.featured = false;
            window.JewelryDB.saveProduct(productData);
            window.AppUI.showToast("New product design registered!", "success");
        }

        productModal.classList.remove("active");
        refreshActiveTab();
    }

    // Exposed API for actions
    window.AdminPanel = {
        // Trigger Edit Modal
        editProduct: function (id) {
            const p = window.JewelryDB.getProductById(id);
            if (!p) return;

            resetCrudForm();

            fId.value = p.id;
            fName.value = p.name;
            fCategory.value = p.category;
            fPrice.value = p.price;
            fOriginalPrice.value = p.originalPrice !== p.price ? p.originalPrice : "";
            fInStock.checked = p.inStock;
            fDesc.value = p.description;
            fImages.value = p.images.join(", ");
            fMetals.value = p.metals.join(", ");
            fSizes.value = p.sizes.join(", ");
            
            // Format details specs back to comma list
            const specsArray = Object.entries(p.details).map(([key, val]) => `${key}: ${val}`);
            fDetails.value = specsArray.join(", ");

            document.getElementById("product-modal-title").textContent = "Edit Jewelry Design";
            productModal.classList.add("active");
        },

        // Trigger Delete Product
        deleteProduct: function (id) {
            if (confirm("Are you sure you want to delete this product? All corresponding customer reviews will be deleted.")) {
                window.JewelryDB.deleteProduct(id);
                window.AppUI.showToast("Product design deleted.", "info");
                refreshActiveTab();
            }
        },

        // Trigger Details Order Modal
        viewOrder: function (id) {
            const orders = window.JewelryDB.getOrders();
            const o = orders.find(ord => ord.id === id);
            if (!o) return;

            const body = document.getElementById("order-detail-modal-body");
            
            const itemsHTML = o.items.map(item => `
                <div style="display: flex; gap: 1rem; border-bottom: 1px solid var(--color-border); padding: 0.8rem 0;">
                    <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover;">
                    <div style="flex-grow: 1; font-size: 0.85rem;">
                        <div style="font-weight: 500;">${item.name}</div>
                        <div style="color: var(--color-text-muted); font-size: 0.75rem;">${item.metal} / Size ${item.size}</div>
                        <div style="font-size: 0.8rem;">Qty ${item.quantity} x $${item.price.toLocaleString()}</div>
                    </div>
                </div>
            `).join("");

            body.innerHTML = `
                <div style="margin-bottom: 1.5rem; font-size: 0.85rem; line-height: 1.6;">
                    <h4 style="font-family: var(--font-sans); font-size: 0.9rem; font-weight: 600; margin-bottom: 0.5rem;">Shipping Address</h4>
                    <p style="font-weight: 500; font-size: 0.95rem;">${o.customerName}</p>
                    <p>${o.address}</p>
                    <p>${o.city}, ${o.state} - ${o.zip}</p>
                    <p><i class="fa-solid fa-phone" style="margin-right: 0.5rem; font-size: 0.75rem;"></i> ${o.phone}</p>
                    <p><i class="fa-solid fa-envelope" style="margin-right: 0.5rem; font-size: 0.75rem;"></i> ${o.email}</p>
                </div>
                
                <div style="margin-bottom: 1.5rem;">
                    <h4 style="font-family: var(--font-sans); font-size: 0.9rem; font-weight: 600; margin-bottom: 0.5rem;">Ordered Items</h4>
                    <div style="max-height: 180px; overflow-y: auto;">
                        ${itemsHTML}
                    </div>
                </div>

                <div style="border-top: 1px solid var(--color-border); padding-top: 1rem; font-size: 0.85rem; display: flex; flex-direction: column; gap: 0.5rem;">
                    <div style="display: flex; justify-content: space-between;">
                        <span>Subtotal:</span>
                        <span>$${o.subtotal.toLocaleString()}</span>
                    </div>
                    ${o.discount > 0 ? `
                    <div style="display: flex; justify-content: space-between; color: green;">
                        <span>Discount (${o.couponCode}):</span>
                        <span>-$${o.discount.toLocaleString()}</span>
                    </div>` : ''}
                    <div style="display: flex; justify-content: space-between;">
                        <span>Shipping:</span>
                        <span>${o.shipping === 0 ? "FREE" : "$" + o.shipping}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-weight: 600; font-size: 1rem; border-top: 1px solid var(--color-border); margin-top: 0.5rem; padding-top: 0.5rem;">
                        <span>Total Paid:</span>
                        <span style="color: var(--color-gold);">$${o.total.toLocaleString()}</span>
                    </div>
                </div>
            `;

            orderModal.classList.add("active");
        },

        // Trigger Change Order Status Select box
        changeOrderStatus: function (id, status) {
            window.JewelryDB.updateOrderStatus(id, status);
            
            // Auto update COD payment status if marked Delivered
            if (status === "Delivered") {
                window.JewelryDB.updateOrderPaymentStatus(id, "Paid");
            }
            
            window.AppUI.showToast(`Order ${id} marked as ${status}!`, "success");
            refreshActiveTab();
        },

        // Delete order from table
        deleteOrder: function (id) {
            if (confirm(`Cancel and delete order record ${id} from logs?`)) {
                window.JewelryDB.deleteOrder(id);
                window.AppUI.showToast("Order record deleted.", "info");
                refreshActiveTab();
            }
        },

        // Delete client review
        deleteReview: function (id) {
            if (confirm("Delete this review post from your products detail page?")) {
                window.JewelryDB.deleteReview(id);
                window.AppUI.showToast("Review post deleted.", "info");
                refreshActiveTab();
            }
        }
    };

    // --- ORDERS MANAGEMENT ---
    function renderOrdersList() {
        const tbody = document.querySelector("#admin-orders-table tbody");
        if (!tbody) return;

        const orders = window.JewelryDB.getOrders();

        if (orders.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--color-text-muted);">No sales orders logged.</td></tr>`;
            return;
        }

        tbody.innerHTML = orders.map(o => {
            const dateStr = new Date(o.date).toLocaleDateString() + " " + new Date(o.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            
            // Options status
            const statuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
            const selectOptions = statuses.map(s => `
                <option value="${s}" ${o.orderStatus === s ? 'selected' : ''}>${s}</option>
            `).join("");

            return `
                <tr>
                    <td style="font-weight: 600;">${o.id}</td>
                    <td>
                        <div style="font-weight: 500;">${o.customerName}</div>
                        <div style="font-size: 0.75rem; color: var(--color-text-muted);">${o.phone}</div>
                    </td>
                    <td>${dateStr}</td>
                    <td style="font-weight: 500; color: var(--color-gold);">$${o.total.toLocaleString()}</td>
                    <td>
                        <div style="font-weight: 500; font-size: 0.8rem;">${o.paymentMethod}</div>
                        <div style="font-size: 0.75rem;" class="${o.paymentStatus === 'Paid' ? 'status-badge delivered' : 'status-badge pending'}">
                            ${o.paymentStatus}
                        </div>
                    </td>
                    <td>
                        <select onchange="AdminPanel.changeOrderStatus('${o.id}', this.value)" style="padding: 0.3rem 0.5rem; font-family: var(--font-sans); font-size: 0.75rem; background: transparent; border: 1px solid var(--color-border);">
                            ${selectOptions}
                        </select>
                    </td>
                    <td style="text-align: right;">
                        <div class="admin-actions-cell" style="justify-content: flex-end;">
                            <button class="admin-btn edit" onclick="AdminPanel.viewOrder('${o.id}')">View</button>
                            <button class="admin-btn delete" onclick="AdminPanel.deleteOrder('${o.id}')">Delete</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join("");
    }

    // --- REVIEWS MODERATION ---
    function renderReviewsList() {
        const tbody = document.querySelector("#admin-reviews-table tbody");
        if (!tbody) return;

        const reviews = window.JewelryDB.getReviews();

        if (reviews.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--color-text-muted);">No reviews written yet.</td></tr>`;
            return;
        }

        tbody.innerHTML = reviews.map(r => `
            <tr>
                <td style="font-weight: 500;">${r.user}</td>
                <td style="font-size: 0.75rem; font-family: monospace;">${r.productId}</td>
                <td style="color: var(--color-gold); font-size: 0.8rem;">
                    ${'<i class="fa-solid fa-star"></i>'.repeat(r.rating)}
                    ${'<i class="fa-regular fa-star"></i>'.repeat(5 - r.rating)}
                </td>
                <td>
                    <div style="font-weight: 500; color: var(--color-dark);">${r.title}</div>
                    <div style="color: var(--color-text-muted); font-size: 0.8rem; max-width: 320px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
                        "${r.comment}"
                    </div>
                </td>
                <td>${r.date}</td>
                <td style="text-align: right;">
                    <div class="admin-actions-cell" style="justify-content: flex-end;">
                        <button class="admin-btn delete" onclick="AdminPanel.deleteReview('${r.id}')">Delete</button>
                    </div>
                </td>
            </tr>
        `).join("");
    }
})();
