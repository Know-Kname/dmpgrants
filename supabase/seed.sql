-- DMP Cemetery Management System - Seed Data
-- Run this AFTER schema.sql in the Supabase SQL Editor
-- NOTE: Create your admin user first via Supabase Auth dashboard,
-- then replace 'YOUR_USER_ID' below with the actual user UUID.

-- ============================================================
-- STEP 1: Create admin user via Supabase Dashboard
-- Go to Authentication > Users > Add User
-- Email: admin@dmp.com
-- Password: (choose a secure password)
-- Copy the user's UUID and paste it below
-- ============================================================

-- Replace this with your actual user UUID from Supabase Auth
-- DO SET auth_user_id = 'YOUR_USER_ID_HERE';

-- ============================================================
-- STEP 2: Sample Work Orders (uncomment after setting user ID)
-- ============================================================

/*
INSERT INTO work_orders (title, description, type, priority, status, created_by) VALUES
  ('Lawn maintenance - Section A', 'Weekly mowing and trimming for the main visitor areas', 'grounds', 'medium', 'pending', 'YOUR_USER_ID_HERE'),
  ('Repair grave marker - Lot 42', 'Marker has shifted and needs realignment', 'repair', 'high', 'in_progress', 'YOUR_USER_ID_HERE'),
  ('Prepare burial site - Lot 156', 'Opening for Jones family burial on Friday', 'burial_prep', 'urgent', 'pending', 'YOUR_USER_ID_HERE'),
  ('Replace sprinkler heads - Section C', 'Three sprinkler heads damaged during winter', 'maintenance', 'low', 'pending', 'YOUR_USER_ID_HERE'),
  ('Tree trimming - Main entrance', 'Overgrown branches blocking pathway lights', 'grounds', 'medium', 'completed', 'YOUR_USER_ID_HERE');
*/

-- ============================================================
-- STEP 3: Sample Grants & Opportunities
-- ============================================================

/*
INSERT INTO grants (title, description, type, source, amount, deadline, status, created_by) VALUES
  ('Historic Cemetery Preservation Grant', 'Federal grant for historic site maintenance and restoration', 'grant', 'National Trust for Historic Preservation', 25000, NOW() + INTERVAL '90 days', 'available', 'YOUR_USER_ID_HERE'),
  ('Veterans Memorial Fund', 'State funding for veteran section improvements and memorials', 'benefit', 'Michigan Dept. of Veterans Affairs', 15000, NOW() + INTERVAL '60 days', 'applied', 'YOUR_USER_ID_HERE'),
  ('Community Green Space Initiative', 'City program for cemetery beautification projects', 'opportunity', 'City of Detroit Parks Dept.', 10000, NOW() + INTERVAL '120 days', 'available', 'YOUR_USER_ID_HERE'),
  ('African American Heritage Sites Program', 'Federal preservation funding for culturally significant sites', 'grant', 'African American Cultural Heritage Action Fund', 50000, NOW() + INTERVAL '45 days', 'applied', 'YOUR_USER_ID_HERE');
*/

-- ============================================================
-- STEP 4: Sample Customers
-- ============================================================

/*
INSERT INTO customers (first_name, last_name, email, phone, address, city, state, zip_code) VALUES
  ('James', 'Williams', 'jwilliams@email.com', '313-555-0101', '1234 Woodward Ave', 'Detroit', 'MI', '48201'),
  ('Mary', 'Johnson', 'mjohnson@email.com', '313-555-0102', '5678 Grand River Ave', 'Detroit', 'MI', '48208'),
  ('Robert', 'Davis', 'rdavis@email.com', '313-555-0103', '9012 Seven Mile Rd', 'Detroit', 'MI', '48235');
*/

-- ============================================================
-- STEP 5: Sample Inventory
-- ============================================================

/*
INSERT INTO inventory (name, category, sku, quantity, unit_cost, reorder_point, supplier, location) VALUES
  ('Standard Concrete Vault', 'vaults', 'VLT-001', 8, 1200.00, 3, 'Michigan Vault Co.', 'Warehouse A'),
  ('Bronze Grave Marker 24x12', 'markers', 'MKR-001', 15, 450.00, 5, 'National Bronze Works', 'Storage B'),
  ('Burial Preparation Kit', 'supplies', 'SUP-001', 25, 85.00, 10, 'Cemetery Supply Corp', 'Warehouse A'),
  ('Riding Lawn Mower', 'equipment', 'EQP-001', 2, 3500.00, 1, 'John Deere Dealer', 'Equipment Shed'),
  ('Flower Arrangement Vases', 'supplies', 'SUP-002', 50, 12.00, 20, 'Floral Supply Inc.', 'Storage B');
*/
