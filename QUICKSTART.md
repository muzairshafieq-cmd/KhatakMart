# Quick Start Guide - Khattak MART

## Get Started in 3 Steps

### Step 1: Create Admin User

**Important**: Before you can access the admin panel, create an admin user:

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **Authentication** → **Users**
4. Click **"Add User"** or **"Invite User"**
5. Enter:
   - **Email**: `admin@khattakmart.com`
   - **Password**: `admin123` (or your preferred secure password)
6. Confirm the email manually in the dashboard (click the user, then verify email)

### Step 2: Run the Application

```bash
npm run dev
```

The application will start at `http://localhost:5173`

### Step 3: Access the Website

**Storefront (Customer View):**
```
http://localhost:5173/
```

**Admin Panel:**
```
http://localhost:5173/#admin
```

Login with the credentials you created in Step 1.

---

## What's Already Set Up

✅ **Database**: Complete schema with 5 tables and RLS policies
✅ **Sample Data**: 5 categories and 16 sample products
✅ **Authentication**: Supabase Auth configured
✅ **Environment Variables**: Supabase connection configured
✅ **Payment Methods**: COD and Easypaisa integrated
✅ **WhatsApp Integration**: Order notifications ready

---

## Testing the Application

### As a Customer:

1. **Browse Products**
   - Open homepage
   - Click on any category
   - View product details

2. **Place an Order**
   - Add products to cart
   - Click cart icon (top right)
   - Proceed to checkout
   - Fill in delivery information
   - Choose COD or Easypaisa
   - Place order
   - Order details will be sent to WhatsApp

### As an Admin:

1. **Login**
   - Go to `http://localhost:5173/#admin`
   - Enter admin credentials

2. **View Dashboard**
   - See order statistics
   - View recent orders

3. **Manage Products**
   - Click "Products" in sidebar
   - Add a new product
   - Edit existing products

4. **Manage Orders**
   - Click "Orders" in sidebar
   - View order details
   - Update order status
   - Verify Easypaisa payments

---

## Important URLs

- **Storefront**: http://localhost:5173/
- **Admin Panel**: http://localhost:5173/#admin
- **Supabase Dashboard**: https://supabase.com/dashboard
- **WhatsApp Business**: https://wa.me/923155770026

---

## Key Features to Test

### Customer Features
- [x] Browse products by category
- [x] View product details
- [x] Add to cart
- [x] Update cart quantities
- [x] Checkout with COD
- [x] Checkout with Easypaisa (with screenshot upload)
- [x] WhatsApp order notification
- [x] Order confirmation page
- [x] Responsive design (try on mobile)

### Admin Features
- [x] Admin login
- [x] Dashboard statistics
- [x] Add/Edit/Delete products
- [x] View all orders
- [x] Filter and search orders
- [x] Update order status
- [x] Update payment status
- [x] View payment proofs
- [x] Send WhatsApp updates

---

## Troubleshooting

**Can't login to admin panel?**
- Make sure you created the admin user in Supabase
- Verify the email in Supabase dashboard
- Check credentials are correct

**Products not showing?**
- Sample products are already added
- Refresh the page
- Check browser console for errors

**WhatsApp not opening?**
- WhatsApp link will open in browser
- On mobile, it should open WhatsApp app
- On desktop, it opens WhatsApp Web

**Build fails?**
- Run `npm install` again
- Clear `node_modules` and reinstall
- Check Node.js version (should be 18+)

---

## Next Steps

1. **Customize Branding**
   - Update business name and location
   - Change theme colors
   - Add your logo

2. **Add Real Products**
   - Remove sample products
   - Add your actual product catalog
   - Upload real product images

3. **Configure Payment**
   - Update Easypaisa number to yours
   - Update WhatsApp number to yours

4. **Deploy to Production**
   - Build: `npm run build`
   - Deploy to Vercel/Netlify
   - Set environment variables in hosting platform

---

## Support

For detailed documentation, see **SETUP.md**

**Business Contact:**
- WhatsApp: +92 315 5770026
- Location: DHA Phase 2, Islamabad

---

**Ready to start selling online!** 🚀
