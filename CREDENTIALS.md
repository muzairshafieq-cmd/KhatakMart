# Khattak MART - Important Information & Credentials

## Business Information

**Business Name**: Khattak MART
**Location**: DHA Phase 2, Islamabad, Pakistan
**Business Type**: Online Grocery Store

---

## Contact Information

**WhatsApp Number**: +92 315 5770026
**Easypaisa Number**: +92 315 5770026
**Email**: admin@khattakmart.com

---

## Admin Access

### Admin Panel URL
```
http://localhost:5173/#admin
```

### Admin Credentials
**Email**: `admin@khattakmart.com`
**Password**: `admin123` (or the password you set in Supabase)

**Note**: You must create this admin user in Supabase Auth before you can login.

### How to Create Admin User
1. Go to Supabase Dashboard
2. Navigate to Authentication → Users
3. Click "Add User"
4. Enter email: `admin@khattakmart.com`
5. Set password: `admin123` (or your choice)
6. Verify the email manually

---

## Supabase Configuration

### Database Connection
- **URL**: `https://gjzotfglnmovxoilspib.supabase.co`
- **Location**: .env file (VITE_SUPABASE_URL)

### Anon Key
- **Location**: .env file (VITE_SUPABASE_ANON_KEY)

---

## Database Schema

### Tables Created
1. **categories** - 5 default categories
   - Dry Grocery
   - Frozen Foods
   - Packaged Milk
   - Snacks & Beverages
   - Cooking Essentials

2. **products** - 16 sample products included
   - Various items across all categories
   - Pakistani grocery items
   - Stock images from Pexels

3. **orders** - Customer orders
   - Tracks all order details
   - Payment method and status
   - Customer information

4. **order_items** - Items in each order
   - Product details at time of order
   - Quantity and pricing

5. **admin_users** - (Deprecated, using Supabase Auth instead)

---

## Payment Information

### Payment Methods Accepted

1. **Cash on Delivery (COD)**
   - Customer pays in cash when order is delivered
   - No advance payment required
   - Payment status tracked in admin panel

2. **Easypaisa**
   - Number: **+92 315 5770026**
   - Customer sends payment via Easypaisa app
   - Customer uploads payment screenshot during checkout
   - Admin verifies payment in admin panel

---

## WhatsApp Integration

### Order Notifications
- **Number**: +92 315 5770026
- **When**: Automatically sent after order placement
- **Contains**: Complete order details

### Order Update Messages
- Admin can send order updates via WhatsApp
- Click WhatsApp icon in order management
- Pre-formatted message with order details

---

## Default Data

### Categories (5)
1. Dry Grocery
2. Frozen Foods
3. Packaged Milk
4. Snacks & Beverages
5. Cooking Essentials

### Sample Products (16)
- Basmati Rice 5kg - Rs. 1,250
- Chakki Atta 10kg - Rs. 950
- Chana Dal 1kg - Rs. 280
- Red Lentils 1kg - Rs. 320
- Frozen Chicken Breast 1kg - Rs. 850
- French Fries 1kg - Rs. 420
- Chicken Nuggets 500g - Rs. 650
- Olpers Milk 1L - Rs. 240
- Nestle Milkpak 1.5L - Rs. 350
- Lays Chips Family Pack - Rs. 180
- Coca Cola 1.5L - Rs. 120
- Sooper Biscuits - Rs. 150
- Cooking Oil 5L - Rs. 1,850
- Pure Desi Ghee 1kg - Rs. 2,200
- Sugar 5kg - Rs. 550
- Salt 800g - Rs. 50

---

## URLs for Testing

### Customer URLs
- **Homepage**: http://localhost:5173/
- **Products**: http://localhost:5173/ (scroll to products section)
- **Checkout**: Add items to cart → Click cart → Checkout

### Admin URLs
- **Login**: http://localhost:5173/#admin
- **Dashboard**: After login → Dashboard tab
- **Products**: After login → Products tab
- **Orders**: After login → Orders tab

---

## Image Sources

All product images are from **Pexels** (free stock photos):
- URL format: `https://images.pexels.com/photos/[id]/[name].jpeg`
- License: Free to use
- No attribution required

---

## Security Notes

### Important for Production

1. **Change Default Password**
   - Default admin password is `admin123`
   - Change this immediately in production

2. **Protect .env File**
   - Never commit .env to Git
   - Keep Supabase keys secure

3. **Use HTTPS**
   - Always use HTTPS in production
   - Required for payment processing

4. **Verify Payments**
   - Always verify Easypaisa screenshots
   - Check payment amounts match orders
   - Update payment status after verification

5. **Customer Data**
   - Handle customer information securely
   - Phone numbers and addresses are sensitive
   - Comply with data protection regulations

---

## Delivery Information

### Current Settings
- **Delivery Area**: DHA Phase 2, Islamabad
- **Delivery Charges**: FREE (Rs. 0)
- **Delivery Time**: Contact customer after order placement

### Future Enhancements
- Multiple delivery areas
- Delivery time slots
- Real-time order tracking
- Delivery charges based on area

---

## Support & Maintenance

### If Something Goes Wrong

1. **Check Supabase Connection**
   - Verify .env file has correct credentials
   - Check Supabase project is active

2. **Check Admin User**
   - Verify admin user exists in Supabase Auth
   - Check email is verified

3. **Check Database**
   - All tables should exist
   - RLS policies should be enabled
   - Sample data should be present

4. **Check Browser Console**
   - Press F12 to open developer tools
   - Check Console tab for errors
   - Check Network tab for failed requests

### Getting Help

- Review SETUP.md for detailed documentation
- Review QUICKSTART.md for quick reference
- Check browser console for error messages
- Verify all environment variables are set

---

## Backup Information

### What to Backup Regularly

1. **Database**
   - Export from Supabase dashboard
   - Backup orders and customers

2. **Product Images**
   - Keep copies of all product images
   - Document image URLs

3. **Configuration**
   - Keep copy of .env file securely
   - Document any custom settings

---

**Last Updated**: 2026-01-01
**Version**: 1.0.0
**Status**: Production Ready

---

**For any questions or issues, refer to SETUP.md or contact the development team.**
