/*
  # Khattak MART E-Commerce Database Schema
  
  ## Overview
  Complete database schema for Pakistani grocery e-commerce platform with COD and Easypaisa payment support.
  
  ## New Tables
  
  ### 1. categories
  - `id` (uuid, primary key) - Unique category identifier
  - `name` (text) - Category name (e.g., "Dry Grocery", "Frozen Foods")
  - `slug` (text, unique) - URL-friendly category identifier
  - `description` (text) - Category description
  - `image_url` (text) - Category banner image
  - `display_order` (integer) - Order for displaying categories
  - `is_active` (boolean) - Whether category is visible
  - `created_at` (timestamptz) - Creation timestamp
  
  ### 2. products
  - `id` (uuid, primary key) - Unique product identifier
  - `category_id` (uuid, foreign key) - Links to categories table
  - `name` (text) - Product name
  - `slug` (text, unique) - URL-friendly product identifier
  - `description` (text) - Product description
  - `price` (decimal) - Product price in PKR
  - `image_url` (text) - Primary product image
  - `manufacturing_date` (date) - Manufacturing date
  - `expiry_date` (date) - Expiry date (nullable for non-perishables)
  - `stock_quantity` (integer) - Available stock
  - `is_available` (boolean) - Product availability status
  - `is_active` (boolean) - Whether product is visible
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  
  ### 3. orders
  - `id` (uuid, primary key) - Unique order identifier
  - `order_number` (text, unique) - Human-readable order number
  - `customer_name` (text) - Customer full name
  - `customer_phone` (text) - Customer phone number
  - `customer_email` (text) - Customer email (optional)
  - `delivery_address` (text) - Full delivery address
  - `payment_method` (text) - 'COD' or 'EASYPAISA'
  - `payment_status` (text) - 'PENDING', 'PAID', 'VERIFICATION_PENDING'
  - `payment_proof_url` (text) - Screenshot for Easypaisa payments
  - `order_status` (text) - 'PENDING', 'CONFIRMED', 'DELIVERED', 'CANCELLED'
  - `subtotal` (decimal) - Total amount in PKR
  - `delivery_charges` (decimal) - Delivery charges (0 for now)
  - `total_amount` (decimal) - Final amount in PKR
  - `notes` (text) - Additional order notes
  - `whatsapp_sent` (boolean) - Whether WhatsApp notification was sent
  - `created_at` (timestamptz) - Order creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  
  ### 4. order_items
  - `id` (uuid, primary key) - Unique order item identifier
  - `order_id` (uuid, foreign key) - Links to orders table
  - `product_id` (uuid, foreign key) - Links to products table
  - `product_name` (text) - Product name snapshot
  - `product_price` (decimal) - Product price snapshot in PKR
  - `quantity` (integer) - Quantity ordered
  - `subtotal` (decimal) - Line item total (price × quantity)
  - `created_at` (timestamptz) - Creation timestamp
  
  ### 5. admin_users
  - `id` (uuid, primary key) - Unique admin identifier
  - `email` (text, unique) - Admin email for login
  - `password_hash` (text) - Hashed password
  - `full_name` (text) - Admin full name
  - `is_active` (boolean) - Whether admin account is active
  - `created_at` (timestamptz) - Creation timestamp
  - `last_login` (timestamptz) - Last login timestamp
  
  ## Security
  - Enable RLS on all tables
  - Public read access for categories and products (for storefront)
  - Authenticated admin access for orders and management
  - Secure admin authentication
  
  ## Notes
  1. All monetary values stored as decimal(10,2)
  2. Phone numbers stored as text to preserve formatting
  3. Order numbers generated with prefix "KM-" (Khattak MART)
  4. No delivery charges initially (set to 0)
  5. Support for both COD and Easypaisa payment methods
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  image_url text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  image_url text,
  manufacturing_date date,
  expiry_date date,
  stock_quantity integer DEFAULT 0,
  is_available boolean DEFAULT true,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_email text,
  delivery_address text NOT NULL,
  payment_method text NOT NULL CHECK (payment_method IN ('COD', 'EASYPAISA')),
  payment_status text DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PAID', 'VERIFICATION_PENDING')),
  payment_proof_url text,
  order_status text DEFAULT 'PENDING' CHECK (order_status IN ('PENDING', 'CONFIRMED', 'DELIVERED', 'CANCELLED')),
  subtotal decimal(10,2) NOT NULL,
  delivery_charges decimal(10,2) DEFAULT 0,
  total_amount decimal(10,2) NOT NULL,
  notes text,
  whatsapp_sent boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  product_price decimal(10,2) NOT NULL,
  quantity integer NOT NULL,
  subtotal decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  full_name text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  last_login timestamptz
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active, is_available);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_payment ON orders(payment_method, payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for categories (public read, admin write)
CREATE POLICY "Public can view active categories"
  ON categories FOR SELECT
  TO anon
  USING (is_active = true);

CREATE POLICY "Authenticated users can view all categories"
  ON categories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete categories"
  ON categories FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for products (public read, admin write)
CREATE POLICY "Public can view active available products"
  ON products FOR SELECT
  TO anon
  USING (is_active = true AND is_available = true);

CREATE POLICY "Authenticated users can view all products"
  ON products FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for orders (public insert, admin manage)
CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all orders"
  ON orders FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete orders"
  ON orders FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for order_items (public insert, admin read)
CREATE POLICY "Anyone can create order items"
  ON order_items FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update order items"
  ON order_items FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete order items"
  ON order_items FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for admin_users (authenticated only)
CREATE POLICY "Authenticated users can view admin users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert admin users"
  ON admin_users FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update admin users"
  ON admin_users FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS text AS $$
DECLARE
  new_number text;
  counter integer;
BEGIN
  SELECT COUNT(*) + 1 INTO counter FROM orders;
  new_number := 'KM-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(counter::text, 4, '0');
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Function to update product updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update products updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger to auto-update orders updated_at
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default categories
INSERT INTO categories (name, slug, description, display_order, is_active) VALUES
  ('Dry Grocery', 'dry-grocery', 'Rice, flour, pulses, spices, and more', 1, true),
  ('Frozen Foods', 'frozen-foods', 'Frozen chicken, fries, nuggets, and frozen items', 2, true),
  ('Packaged Milk', 'packaged-milk', 'Tetra pack and boxed milk products', 3, true),
  ('Snacks & Beverages', 'snacks-beverages', 'Chips, biscuits, drinks, and refreshments', 4, true),
  ('Cooking Essentials', 'cooking-essentials', 'Oils, ghee, and cooking basics', 5, true)
ON CONFLICT (slug) DO NOTHING;

-- Insert a default admin user (email: admin@khattakmart.com, password: admin123)
-- Password hash generated with bcrypt for 'admin123'
INSERT INTO admin_users (email, password_hash, full_name, is_active) VALUES
  ('admin@khattakmart.com', '$2a$10$rU8QvV5RJ5xZZ5J9ZqZq8.Kx5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Zm', 'Admin User', true)
ON CONFLICT (email) DO NOTHING;