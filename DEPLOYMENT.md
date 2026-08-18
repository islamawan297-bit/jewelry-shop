# AURUM Jewelry E-Commerce — Domain, Hosting & Integration Setup Guide

Because this website is built using a modern, lightweight, multi-page static HTML5/CSS3/JavaScript architecture, it requires **no compilation, no server-side build steps, and no complex databases** to run. 

This means you can host the website **completely free** on premium static hosting networks (like Vercel, Netlify, or GitHub Pages). This gives the site sub-second load times globally, infinite scaling capacity (it won't crash during traffic spikes), and zero monthly server hosting bills.

---

## 1. Domain Registration

To secure a premium address (e.g., `www.aurumjewelry.co` or your brand name):
1. **Choose a Registrar**: Namecheap, GoDaddy, Google Domains (now Squarespace), or Porkbun.
2. **Search for Brand Names**: Try adding nouns or adjectives like `aurumfine.com`, `aurumjewelry.co`, `aurumatelier.com` if `.com` is taken.
3. **Purchase the Domain**: Keep auto-renew enabled to secure the domain name.

---

## 2. Setting Up Free Hosting

### Option A: Vercel (Recommended)
Vercel is the fastest hosting network with a built-in global CDN.
1. Create a free account at [Vercel](https://vercel.com).
2. Install the Vercel CLI on your machine by running:
   ```bash
   npm install -g vercel
   ```
3. Open your terminal in the `jewelry` directory and type:
   ```bash
   vercel
   ```
4. Follow the prompts (login, link project, select default settings). Within 30 seconds, your site will be live on a `*.vercel.app` subdomain.
5. Alternatively, push your folder to a private/public **GitHub repository**, go to the Vercel dashboard, click **Add New Project**, and import the repository. Vercel will auto-deploy every time you push code changes.

### Option B: Netlify (Drag-and-Drop Simple)
1. Create a free account at [Netlify](https://www.netlify.com).
2. Go to the Netlify Dashboard -> Projects.
3. Scroll down to the **Drag and Drop** section.
4. Drag your entire `jewelry` folder containing `index.html` and drop it into the box.
5. Your site is instantly deployed with a temporary `*.netlify.app` link.

### Option C: GitHub Pages
1. Push your folder to a GitHub repository.
2. Go to the repository **Settings** tab.
3. On the left sidebar, click **Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**.
5. Set the branch to `main` (or `master`) and the folder to `/ (root)`. Click **Save**.
6. Your site will be online at `https://<your-username>.github.io/<repo-name>/` in a few minutes.

---

## 3. Configuring Custom Domains & DNS

Once your site is hosted on Vercel or Netlify, you can link your custom purchased domain:
1. In Vercel/Netlify, go to **Project Settings -> Domains -> Add Custom Domain**.
2. Type in your domain name (e.g., `aurumjewelry.co`).
3. The hosting provider will give you the DNS records to configure. Typically:
   - **A Record**: Point `@` host to IP `76.76.21.21` (for Vercel) or Netlify's load balancer IP.
   - **CNAME Record**: Point `www` to `cname.vercel-dns.com` or your Netlify app URL.
4. Log in to your domain registrar dashboard (Namecheap/GoDaddy), go to **Advanced DNS Settings**, and replace/add these records.
5. Allow 1-24 hours for DNS propagation. SSL certificates (HTTPS padlock) will be generated automatically and free of charge.

---

## 4. Production Integrations

To transition the site from "demonstration" mode into a fully functioning, money-collecting store, update these files:

### A. WhatsApp Concierge Redirection
In [`checkout.html`](file:///c:/Users/MAKKAH%20TECH/jewelry/checkout.html#L427-L430), find the phone number in `placeWhatsAppOrder()`:
```javascript
// Replace this placeholder with your store's real WhatsApp number (including country code, without + or spaces)
const phoneNumber = "912287654321"; // Replace with (e.g.) "919999999999" for India
```

### B. Integrating Real Payments (Razorpay Checkout)
To replace the mock UPI/QR Code payment modal with Razorpay's official checkout popup:
1. Register a merchant account at [Razorpay](https://razorpay.com) and complete your KYC.
2. In the Razorpay dashboard, navigate to **Settings -> API Keys** and generate your **Key ID**.
3. In [`checkout.html`](file:///c:/Users/MAKKAH%20TECH/jewelry/checkout.html), include the official Razorpay script inside the `<head>`:
   ```html
   <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
   ```
4. Replace the custom `openRazorpayGateway(orderData)` function with the official Razorpay trigger:
   ```javascript
   function openRazorpayGateway(orderData) {
       const options = {
           "key": "YOUR_RAZORPAY_KEY_ID", // Replace with your Live/Test Key ID
           "amount": orderData.total * 100, // Razorpay works in paise (e.g., $10 = 1000 cents)
           "currency": "USD",
           "name": "AURUM Fine Jewelry",
           "description": "Purchase Reference ID: " + orderData.items.map(i => i.name).join(", "),
           "image": "https://yourdomain.com/assets/logo.png",
           "handler": function (response) {
               // This function executes on payment success
               orderData.paymentStatus = "Paid";
               orderData.transactionId = response.razorpay_payment_id;
               
               const newOrder = window.JewelryDB.saveOrder(orderData);
               window.CartAPI.clearCart();
               renderSuccessReceipt(newOrder);
               window.AppUI.showToast("Payment Successful!", "success");
           },
           "prefill": {
               "name": orderData.customerName,
               "email": orderData.email,
               "contact": orderData.phone
           },
           "theme": {
               "color": "#D4AF37" // Matches our Gold accent
           }
       };
       const rzp1 = new Razorpay(options);
       rzp1.open();
   }
   ```

---

## 5. Transitioning to a Cloud Database (Roadmap)

Currently, all inventory updates, reviews, and client orders are saved inside the visitor's browser `localStorage`. While this is perfect for local testing and quick administration, visitors will not see each other's edits, and orders will not sync to your administrative computer automatically in a true production setup.

When scaling up to a centralized store:
1. **Set Up a Serverless Database**: We recommend [Supabase](https://supabase.com) (built on Postgres, has a free tier) or [Firebase Firestore](https://firebase.google.com).
2. **Rewrite the Database Access Functions**: In [`js/products.js`](file:///c:/Users/MAKKAH%20TECH/jewelry/js/products.js), rewrite the `window.JewelryDB` methods to read/write from your database API instead of `localStorage`.
   - For example, retrieve products from Supabase:
     ```javascript
     getProducts: async function () {
         const { data, error } = await supabase.from('products').select('*');
         return data || [];
     }
     ```
3. This swap will take less than 100 lines of code, and because the database methods are centralized in `products.js`, no other HTML pages will need modifications.
