/**
 * Jewelry Brand Database Layer (Local Storage)
 */

(function () {
    const DEFAULT_PRODUCTS = [
        {
            id: "ring-aurora",
            name: "Aurora Diamond Solitaire",
            category: "Rings",
            price: 1850,
            originalPrice: 2200,
            isSale: true,
            featured: true,
            inStock: true,
            rating: 4.9,
            reviewCount: 38,
            sizes: ["5", "6", "7", "8", "9"],
            metals: ["18K Yellow Gold", "18K White Gold", "18K Rose Gold"],
            images: [
                "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop"
            ],
            description: "A breathtaking solitaire ring featuring a hand-selected round brilliant cut diamond claw-set in an elegant, modern gold band. Designed to capture light from every angle, the Aurora Ring is a classic symbol of eternal elegance.",
            details: {
                "Material": "18K Gold (Yellow, White, or Rose)",
                "Main Stone": "Natural Round Brilliant Diamond",
                "Carat Weight": "0.85 Carat",
                "Color / Clarity": "G-H / VS1-VS2",
                "Certification": "GIA Certified Included",
                "Band Width": "1.8mm"
            }
        },
        {
            id: "ring-celestial",
            name: "Celestial Sapphire Band",
            category: "Rings",
            price: 1450,
            originalPrice: 1450,
            isSale: false,
            featured: true,
            inStock: true,
            rating: 4.8,
            reviewCount: 16,
            sizes: ["5", "6", "7", "8", "9"],
            metals: ["18K White Gold", "18K Yellow Gold"],
            images: [
                "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop"
            ],
            description: "Inspired by the night sky, this band features alternating deep-blue Ceylon sapphires and brilliant round diamonds in a secure micro-pave setting. A perfect wedding band, anniversary gift, or stacking piece.",
            details: {
                "Material": "18K White Gold or Yellow Gold",
                "Stones": "Blue Ceylon Sapphires & Brilliant Diamonds",
                "Total Carat Weight": "0.60 TCW",
                "Sapphires": "0.35 Carat Total",
                "Diamonds": "0.25 Carat Total",
                "Band Width": "2.2mm"
            }
        },
        {
            id: "necklace-aurelia",
            name: "Aurelia Gold Pendant",
            category: "Necklaces",
            price: 950,
            originalPrice: 1100,
            isSale: true,
            featured: true,
            inStock: true,
            rating: 4.7,
            reviewCount: 22,
            sizes: ["16 inches", "18 inches", "20 inches"],
            metals: ["18K Yellow Gold", "18K Rose Gold"],
            images: [
                "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=800&auto=format&fit=crop"
            ],
            description: "The Aurelia Gold Pendant features an exquisitely detailed medallion with a central starburst engraving encasing a tiny sparkling diamond. Suspended from a delicate diamond-cut cable chain, it rests perfectly on the collarbone.",
            details: {
                "Material": "18K Solid Yellow Gold or Rose Gold",
                "Stone": "Natural Round Diamond (0.03 Carat)",
                "Chain Length": "Adjustable (16, 18, 20 inches)",
                "Pendant Dimensions": "15mm diameter",
                "Weight": "4.2 grams"
            }
        },
        {
            id: "necklace-seraphina",
            name: "Seraphina Emerald Drops",
            category: "Necklaces",
            price: 2400,
            originalPrice: 2400,
            isSale: false,
            featured: false,
            inStock: true,
            rating: 5.0,
            reviewCount: 9,
            sizes: ["16 inches", "18 inches"],
            metals: ["18K Yellow Gold", "18K White Gold"],
            images: [
                "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=800&auto=format&fit=crop"
            ],
            description: "A showcase of exceptional gemstones. The Seraphina necklace features a pear-cut natural Zambian emerald surrounded by a halo of micro-brilliant diamonds, dropping gracefully from a solid gold necklace.",
            details: {
                "Material": "18K Yellow Gold",
                "Main Stone": "Natural Zambian Emerald (Pear Cut)",
                "Main Stone Carat": "1.2 Carats",
                "Diamond Carats": "0.45 TCW",
                "Clarity": "Highly Transparent with minor eye-clean inclusions"
            }
        },
        {
            id: "earring-hoop-classic",
            name: "Elysian Gold Hoops",
            category: "Earrings",
            price: 650,
            originalPrice: 750,
            isSale: true,
            featured: true,
            inStock: true,
            rating: 4.6,
            reviewCount: 42,
            sizes: ["Small (15mm)", "Medium (25mm)", "Large (35mm)"],
            metals: ["18K Yellow Gold", "18K Rose Gold", "18K White Gold"],
            images: [
                "https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=800&auto=format&fit=crop"
            ],
            description: "Effortlessly elegant gold hoops crafted with a sleek flat edge profile. Hollow inside for lightweight, all-day comfortable wear, yet sturdy and secured with an click-close safety clasp. An everyday essential.",
            details: {
                "Material": "18K Solid Gold",
                "Finish": "High Polish Mirror Finish",
                "Clasp": "Hinge & Click Closure",
                "Width": "3.5mm",
                "Weight (Medium)": "3.8 grams per pair"
            }
        },
        {
            id: "earring-pearl-luna",
            name: "Luna Baroque Pearl Droplets",
            category: "Earrings",
            price: 820,
            originalPrice: 820,
            isSale: false,
            featured: false,
            inStock: true,
            rating: 4.9,
            reviewCount: 14,
            sizes: ["Standard"],
            metals: ["18K Yellow Gold"],
            images: [
                "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop"
            ],
            description: "Each Baroque Pearl is entirely unique, formed by nature with beautiful organic contours. Hand-selected for their high luster and rainbow overtones, they hang from detailed gold flowers inset with diamonds.",
            details: {
                "Material": "18K Gold Vermeil & Solid Posts",
                "Pearls": "AAA Grade Cultured Fresh Water Baroque Pearls",
                "Pearl Size": "12mm - 14mm",
                "Accent Stones": "Round Brilliant Diamonds (0.05 TCW)",
                "Length": "Approx. 32mm total drop"
            }
        },
        {
            id: "bracelet-tether",
            name: "Eternity Diamond Link",
            category: "Bracelets",
            price: 2900,
            originalPrice: 3500,
            isSale: true,
            featured: true,
            inStock: true,
            rating: 4.9,
            reviewCount: 11,
            sizes: ["6.5 inches", "7.0 inches", "7.5 inches"],
            metals: ["18K White Gold", "18K Yellow Gold"],
            images: [
                "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=800&auto=format&fit=crop"
            ],
            description: "A continuous loop of brilliant round diamonds basket-set in heavy gold links. Features an integrated seamless box clasp with double safety latches. The ultimate wrist luxury designed for spectacular sparkle.",
            details: {
                "Material": "18K White Gold",
                "Stones": "Brilliant Cut Diamonds",
                "Total Carat Weight": "3.5 Carats (approx for 7.0\")",
                "Diamond Count": "58 Diamonds",
                "Color / Clarity": "F-G / VS1-VS2",
                "Clasp": "Double-safety Box Lock"
            }
        },
        {
            id: "bracelet-minimalist",
            name: "Verona Gold Bangle",
            category: "Bracelets",
            price: 1100,
            originalPrice: 1100,
            isSale: false,
            featured: false,
            inStock: true,
            rating: 4.7,
            reviewCount: 19,
            sizes: ["Small (55mm)", "Medium (60mm)", "Large (65mm)"],
            metals: ["18K Yellow Gold", "18K White Gold", "18K Rose Gold"],
            images: [
                "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=800&auto=format&fit=crop"
            ],
            description: "A minimalist gold hinge bangle with a beautiful polished interior and a brushed satin exterior. Sleek, sculptural, and perfect for engraving a personalized message inside. Great for stacking.",
            details: {
                "Material": "18K Gold",
                "Width": "4mm",
                "Thickness": "2mm",
                "Lock": "Concealed push release side-button",
                "Weight": "12.5 grams"
            }
        },
        {
            id: "set-empress",
            name: "Empress Diamond & Emerald Set",
            category: "Sets",
            price: 4950,
            originalPrice: 5800,
            isSale: true,
            featured: true,
            inStock: true,
            rating: 5.0,
            reviewCount: 7,
            sizes: ["Standard (Ring Size 7 included)"],
            metals: ["18K Yellow Gold", "18K White Gold"],
            images: [
                "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1543294001-f7cbfe92237e?q=80&w=800&auto=format&fit=crop"
            ],
            description: "The crown jewel of our collection. This luxurious matching suite includes the Empress Pendant Necklace, matching Empress Droplet Earrings, and the halo Ring. Adorned with matching deep emerald green corundums and sparkling halos of brilliant cut diamonds.",
            details: {
                "Material": "18K White Gold",
                "Set Includes": "1x Pendant Necklace, 1x Pair of Drop Earrings, 1x Halo Ring",
                "Main Stones": "Vibrant Forest Green Emerald-cuts",
                "Emerald Total Weight": "4.8 Carats across set",
                "Diamond Accent Weight": "1.65 Carats Total",
                "Packaging": "Lined Mahogany Wood Presentation Chest"
            }
        }
    ];

    const DEFAULT_REVIEWS = [
        {
            id: "rev-1",
            productId: "ring-aurora",
            user: "Sophia Martinez",
            rating: 5,
            date: "2026-07-15",
            title: "Absolutely Stunned!",
            comment: "My fiance proposed with this ring and I cannot stop looking at it. The cut of the diamond is incredibly clear and sparkles in the lowest lighting! 10/10 recommendation."
        },
        {
            id: "rev-2",
            productId: "ring-aurora",
            user: "James Sterling",
            rating: 5,
            date: "2026-06-28",
            title: "Perfect service and ring",
            comment: "The sizing guide was extremely accurate. Customer service helped me select the 18K yellow gold band. The box was premium and shipping was fully secured."
        },
        {
            id: "rev-3",
            productId: "necklace-aurelia",
            user: "Elena Rostova",
            rating: 4,
            date: "2026-08-01",
            title: "Beautiful Everyday Necklace",
            comment: "I wear this nearly everyday. It's delicate but very shiny. The small starburst design gets lots of compliments. Only wish the chain was slightly thicker, but it is sturdy."
        },
        {
            id: "rev-4",
            productId: "earring-hoop-classic",
            user: "Charlotte B.",
            rating: 5,
            date: "2026-08-10",
            title: "Lighter than they look!",
            comment: "I was worried these would weigh down my ears, but they are hollow and so comfortable. They close with a secure click. Will purchase in White Gold next!"
        }
    ];

    const DEFAULT_ORDERS = [
        {
            id: "ORD-9281",
            date: "2026-08-15T10:30:00Z",
            customerName: "Sarah Jenkins",
            email: "sarah.j@example.com",
            phone: "+91 98765 43210",
            address: "45 Orchid Towers, Phase 1, Jubilee Hills",
            city: "Hyderabad",
            state: "Telangana",
            zip: "500033",
            items: [
                {
                    id: "necklace-aurelia",
                    name: "Aurelia Gold Pendant",
                    price: 950,
                    quantity: 1,
                    metal: "18K Yellow Gold",
                    size: "18 inches",
                    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800"
                }
            ],
            subtotal: 950,
            discount: 95,
            couponCode: "GOLD10",
            shipping: 0,
            total: 855,
            paymentMethod: "Razorpay (Online)",
            paymentStatus: "Paid",
            orderStatus: "Processing"
        },
        {
            id: "ORD-5192",
            date: "2026-08-16T14:15:00Z",
            customerName: "Arjun Mehta",
            email: "arjun.m@example.com",
            phone: "+91 91234 56789",
            address: "Flat 202, Sunset Vista, Bandra West",
            city: "Mumbai",
            state: "Maharashtra",
            zip: "400050",
            items: [
                {
                    id: "earring-hoop-classic",
                    name: "Elysian Gold Hoops",
                    price: 650,
                    quantity: 2,
                    metal: "18K Yellow Gold",
                    size: "Medium (25mm)",
                    image: "https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=800"
                }
            ],
            subtotal: 1300,
            discount: 0,
            couponCode: "",
            shipping: 15,
            total: 1315,
            paymentMethod: "Cash on Delivery (COD)",
            paymentStatus: "Pending",
            orderStatus: "Pending"
        }
    ];

    const KEYS = {
        PRODUCTS: "jewelry_products",
        REVIEWS: "jewelry_reviews",
        ORDERS: "jewelry_orders"
    };

    function initDB() {
        if (!localStorage.getItem(KEYS.PRODUCTS)) {
            localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
        }
        if (!localStorage.getItem(KEYS.REVIEWS)) {
            localStorage.setItem(KEYS.REVIEWS, JSON.stringify(DEFAULT_REVIEWS));
        }
        if (!localStorage.getItem(KEYS.ORDERS)) {
            localStorage.setItem(KEYS.ORDERS, JSON.stringify(DEFAULT_ORDERS));
        }
    }

    initDB();

    window.JewelryDB = {
        getProducts: function () {
            return JSON.parse(localStorage.getItem(KEYS.PRODUCTS)) || [];
        },
        getProductById: function (id) {
            const products = this.getProducts();
            return products.find(p => p.id === id) || null;
        },
        saveProduct: function (productData) {
            const products = this.getProducts();
            const index = products.findIndex(p => p.id === productData.id);
            
            if (index !== -1) {
                products[index] = { ...products[index], ...productData };
            } else {
                products.push(productData);
            }
            
            localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
            return productData;
        },
        deleteProduct: function (id) {
            let products = this.getProducts();
            products = products.filter(p => p.id !== id);
            localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
            
            let reviews = this.getReviews();
            reviews = reviews.filter(r => r.productId !== id);
            localStorage.setItem(KEYS.REVIEWS, JSON.stringify(reviews));
            return true;
        },

        getReviews: function () {
            return JSON.parse(localStorage.getItem(KEYS.REVIEWS)) || [];
        },
        getReviewsByProduct: function (productId) {
            const reviews = this.getReviews();
            return reviews.filter(r => r.productId === productId);
        },
        addReview: function (productId, reviewData) {
            const reviews = this.getReviews();
            const newReview = {
                id: "rev-" + Date.now(),
                productId: productId,
                user: reviewData.user || "Anonymous",
                rating: parseInt(reviewData.rating) || 5,
                date: new Date().toISOString().split('T')[0],
                title: reviewData.title || "",
                comment: reviewData.comment || ""
            };
            
            reviews.unshift(newReview);
            localStorage.setItem(KEYS.REVIEWS, JSON.stringify(reviews));

            this.recalculateProductRating(productId);
            return newReview;
        },
        deleteReview: function (reviewId) {
            let reviews = this.getReviews();
            const reviewToDelete = reviews.find(r => r.id === reviewId);
            if (!reviewToDelete) return false;
            
            reviews = reviews.filter(r => r.id !== reviewId);
            localStorage.setItem(KEYS.REVIEWS, JSON.stringify(reviews));
            
            this.recalculateProductRating(reviewToDelete.productId);
            return true;
        },
        recalculateProductRating: function (productId) {
            const reviews = this.getReviewsByProduct(productId);
            const products = this.getProducts();
            const prodIndex = products.findIndex(p => p.id === productId);
            
            if (prodIndex !== -1) {
                if (reviews.length === 0) {
                    products[prodIndex].rating = 0;
                    products[prodIndex].reviewCount = 0;
                } else {
                    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
                    products[prodIndex].rating = parseFloat((totalRating / reviews.length).toFixed(1));
                    products[prodIndex].reviewCount = reviews.length;
                }
                localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
            }
        },

        getOrders: function () {
            return JSON.parse(localStorage.getItem(KEYS.ORDERS)) || [];
        },
        saveOrder: function (orderData) {
            const orders = this.getOrders();
            const newOrder = {
                id: "ORD-" + Math.floor(1000 + Math.random() * 9000),
                date: new Date().toISOString(),
                orderStatus: "Pending",
                paymentStatus: orderData.paymentMethod === "Cash on Delivery (COD)" ? "Pending" : "Paid",
                ...orderData
            };
            
            orders.unshift(newOrder);
            localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
            return newOrder;
        },
        updateOrderStatus: function (orderId, status) {
            const orders = this.getOrders();
            const index = orders.findIndex(o => o.id === orderId);
            if (index !== -1) {
                orders[index].orderStatus = status;
                localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
                return true;
            }
            return false;
        },
        updateOrderPaymentStatus: function (orderId, paymentStatus) {
            const orders = this.getOrders();
            const index = orders.findIndex(o => o.id === orderId);
            if (index !== -1) {
                orders[index].paymentStatus = paymentStatus;
                localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
                return true;
            }
            return false;
        },
        deleteOrder: function (orderId) {
            let orders = this.getOrders();
            orders = orders.filter(o => o.id !== orderId);
            localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
            return true;
        }
    };
})();
