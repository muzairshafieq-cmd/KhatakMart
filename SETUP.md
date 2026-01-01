# Khattak MART - E-Commerce Grocery Website

A modern, fully-featured e-commerce platform for online grocery shopping in Pakistan, built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

### Customer Features
- **Modern Homepage** with categories and featured products
- **Product Catalog** with filtering by category
- **Product Details** with images, prices, manufacturing/expiry dates
- **Shopping Cart** with quantity management and persistent storage
- **Checkout System** with two payment methods:
  - Cash on Delivery (COD)
  - Easypaisa (with payment proof upload)
- **WhatsApp Integration** - Order details automatically sent to WhatsApp
- **Order Confirmation** page with order number
- **Free Delivery** - No delivery charges
- **Fully Responsive** design for mobile, tablet, and desktop

### Admin Features
- **Secure Admin Login** with authentication
- **Dashboard** with real-time statistics:
  - Total orders, pending orders, today's orders
  - Total revenue
  - COD vs Easypaisa order breakdown
  - Recent orders list
- **Product Management**:
  - Add/Edit/Delete products
  - Upload product images
  - Set pricing, stock, and availability
  - Set manufacturing and expiry dates
  - Category management
- **Order Management**:
  - View all orders with search and filtering
  - View detailed order information
  - Update order status (Pending/Confirmed/Delivered/Cancelled)
  - Update payment status (Pending/Verification Pending/Paid)
  - View Easypaisa payment proofs
  - Send order updates via WhatsApp

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Build Tool**: Vite
- **Deployment**: Static hosting (Vercel, Netlify, etc.)

## Database Schema

### Tables
1. **categories** - Product categories (Dry Grocery, Frozen Foods, etc.)
2. **products** - All product information
3. **orders** - Customer orders with payment and delivery details
4. **order_items** - Individual items in each order
5. **admin_users** - Admin authentication (deprecated - using Supabase Auth)

### Security
- Row Level Security (RLS) enabled on all tables
- Public read access for storefront
- Authenticated admin access for management
- Secure payment proof uploads

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Supabase account
- npm or yarn package manager

### 1. Clone and Install

```bash
git clone <repository-url>
cd khattak-mart
npm install
```

### 2. Supabase Setup

The database schema is already set up with:
- All required tables with RLS policies
- Sample categories (Dry Grocery, Frozen Foods, Packaged Milk, etc.)
- Sample products (16 products across all categories)

### 3. Environment Variables

Your `.env` file is already configured:
```
VITE_SUPABASE_URL=https://gjzotfglnmovxoilspib.supabase.co
VITE_SUPABASE_ANON_KEY=<your-key>
```

### 4. Create Admin User

To access the admin panel, create an admin user in Supabase:

**Option A: Using Supabase Dashboard**
1. Go to your Supabase project dashboard
2. Navigate to Authentication → Users
3. Click "Add User"
4. Use these credentials:
   - Email: `admin@khattakmart.com`
   - Password: `admin123` (or your preferred password)
5. Confirm the user's email manually in the dashboard

**Option B: Using Sign Up Page (Future Enhancement)**
- Currently, admin users must be created via Supabase dashboard
- Future versions can include an admin registration endpoint

### 5. Run the Application

**Development Mode:**
```bash
npm run dev
```

**Build for Production:**
```bash
npm run build
npm run preview
```

The application will be available at:
- **Storefront**: `http://localhost:5173/`
- **Admin Panel**: `http://localhost:5173/#admin`

## Usage Guide

### For Customers

1. **Browse Products**
   - View featured products on the homepage
   - Click on categories to filter products
   - Click on any product to view details

2. **Add to Cart**
   - Click "Add to Cart" on product cards or detail pages
   - View cart by clicking the cart icon in the header
   - Adjust quantities or remove items in the cart

3. **Checkout**
   - Click "Proceed to Checkout" in the cart
   - Fill in delivery information:
     - Full name
     - Phone number
     - Email (optional)
     - Complete delivery address
   - Choose payment method:
     - **COD**: Pay when order is delivered
     - **Easypaisa**: Send payment to +92 315 5770026 and upload screenshot
   - Click "Place Order"

4. **Order Confirmation**
   - Order details are automatically sent to WhatsApp
   - You'll receive an order number
   - Store will contact you to confirm delivery

### For Administrators

1. **Login**
   - Navigate to `http://localhost:5173/#admin`
   - Enter admin credentials
   - Default: `admin@khattakmart.com` / `admin123`

2. **Dashboard**
   - View order statistics and revenue
   - See recent orders at a glance
   - Monitor COD vs Easypaisa orders

3. **Manage Products**
   - Click "Products" in the sidebar
   - **Add Product**: Click "Add Product" button
     - Fill in product details
     - Add image URL from Pexels or other stock photo sites
     - Set pricing and stock
     - Add manufacturing/expiry dates if applicable
   - **Edit Product**: Click edit icon on any product
   - **Delete Product**: Click delete icon (with confirmation)

4. **Manage Orders**
   - Click "Orders" in the sidebar
   - Search by order number, customer name, or phone
   - Filter by order status
   - **View Order Details**: Click eye icon
   - **Update Status**: Change order or payment status in detail view
   - **View Payment Proof**: For Easypaisa orders, click to view screenshot
   - **Send to WhatsApp**: Click WhatsApp icon to send order update

## Payment Methods

### Cash on Delivery (COD)
- Customer pays in cash when order is delivered
- Payment status: "PENDING"
- Safe and convenient for customers

### Easypaisa
- Easypaisa Number: **+92 315 5770026**
- Customer sends payment via Easypaisa
- Customer uploads payment screenshot during checkout
- Payment status: "VERIFICATION_PENDING"
- Admin verifies payment and updates status to "PAID"

## WhatsApp Integration

All orders are automatically sent to WhatsApp: **+92 315 5770026**

**Order Message Includes:**
- Order number
- Customer details (name, phone, email, address)
- List of ordered items with quantities and prices
- Payment method and status
- Total amount
- Order notes (if any)

## Configuration

### Update Business Information

**Header and Footer** (`src/components/Header.tsx` and `src/components/HomePage.tsx`):
```typescript
// Change store name
<h1>Khattak MART</h1>

// Change location
<p>DHA Phase 2, Islamabad</p>
```

**WhatsApp Number** (Multiple files):
- `src/components/Checkout.tsx` - Line with `whatsappUrl`
- `src/components/admin/OrderManagement.tsx` - Line with `whatsappUrl`

**Easypaisa Number** (`src/components/Checkout.tsx`):
```typescript
<p className="text-lg font-bold text-green-600">
  +92 315 5770026
</p>
```

### Add More Categories

Run SQL in Supabase SQL Editor:
```sql
INSERT INTO categories (name, slug, description, display_order, is_active)
VALUES ('New Category', 'new-category', 'Description here', 6, true);
```

### Update Theme Colors

Edit `tailwind.config.js` or change class names:
- Primary color: `green-600` (currently)
- Change to any Tailwind color: `blue-600`, `indigo-600`, etc.

## Deployment

### Build for Production
```bash
npm run build
```

This creates a `dist` folder with optimized static files.

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

### Deploy to Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Environment Variables
Make sure to set environment variables in your hosting platform:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## File Structure

```
khattak-mart/
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminLogin.tsx
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── ProductManagement.tsx
│   │   │   └── OrderManagement.tsx
│   │   ├── Header.tsx
│   │   ├── HomePage.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── Cart.tsx
│   │   └── Checkout.tsx
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   └── CartContext.tsx
│   ├── lib/
│   │   └── supabase.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── .env
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

## Security Best Practices

1. **Environment Variables**: Never commit `.env` file to Git
2. **Admin Authentication**: Use strong passwords for admin accounts
3. **RLS Policies**: All tables have Row Level Security enabled
4. **Payment Verification**: Always verify Easypaisa payments before marking as paid
5. **HTTPS**: Always use HTTPS in production
6. **Input Validation**: All forms validate user input

## Support & Maintenance

### Common Issues

**Admin Login Not Working:**
- Ensure admin user is created in Supabase Auth
- Check email is verified in Supabase dashboard
- Verify credentials match

**Products Not Displaying:**
- Check products are marked as `is_active` and `is_available` in database
- Verify category is active

**Orders Not Saving:**
- Check browser console for errors
- Verify Supabase connection
- Check RLS policies allow public inserts on orders table

**WhatsApp Not Opening:**
- Verify WhatsApp number format: +923155770026
- Check if WhatsApp is installed on mobile
- On desktop, WhatsApp Web should open

## Future Enhancements

- User accounts and order history
- Email notifications
- SMS notifications via local SMS gateway
- Product search functionality
- Product reviews and ratings
- Inventory low stock alerts
- Discount coupons and promotions
- Multiple delivery areas and charges
- Delivery time slot selection
- Order tracking
- Payment gateway integration (JazzCash, EasyPaisa direct integration)
- Mobile app version

## Contact Information

**Khattak MART**
- Location: DHA Phase 2, Islamabad, Pakistan
- WhatsApp: +92 315 5770026
- Easypaisa: +92 315 5770026

## License

This project is proprietary software for Khattak MART.

---

**Built with ❤️ for Khattak MART**
