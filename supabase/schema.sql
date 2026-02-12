-- DMP Cemetery Management System - Supabase Schema
-- Run this in your Supabase SQL Editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Work Orders Table
CREATE TABLE IF NOT EXISTS work_orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL CHECK (type IN ('maintenance', 'burial_prep', 'grounds', 'repair', 'other')),
  priority VARCHAR(20) NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')) DEFAULT 'pending',
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  due_date TIMESTAMPTZ,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Grants Table
CREATE TABLE IF NOT EXISTS grants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL CHECK (type IN ('grant', 'benefit', 'opportunity')),
  source VARCHAR(255) NOT NULL,
  amount DECIMAL(12, 2),
  deadline TIMESTAMPTZ,
  status VARCHAR(20) NOT NULL CHECK (status IN ('available', 'applied', 'approved', 'denied', 'received')) DEFAULT 'available',
  application_date TIMESTAMPTZ,
  notes TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customers Table
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(50),
  zip_code VARCHAR(20),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inventory Table
CREATE TABLE IF NOT EXISTS inventory (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('caskets', 'urns', 'vaults', 'markers', 'supplies', 'equipment')),
  sku VARCHAR(100),
  quantity INTEGER NOT NULL DEFAULT 0,
  unit_cost DECIMAL(10, 2),
  reorder_point INTEGER DEFAULT 5,
  supplier VARCHAR(255),
  location VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Burials Table
CREATE TABLE IF NOT EXISTS burials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  deceased_name VARCHAR(255) NOT NULL,
  date_of_birth DATE,
  date_of_death DATE,
  burial_date DATE,
  burial_time TIME,
  section VARCHAR(50),
  lot VARCHAR(50),
  space VARCHAR(50),
  burial_type VARCHAR(50) CHECK (burial_type IN ('traditional', 'cremation', 'green')),
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  funeral_home VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contracts Table
CREATE TABLE IF NOT EXISTS contracts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  contract_number VARCHAR(50) UNIQUE NOT NULL,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('pre_need', 'at_need')),
  status VARCHAR(20) NOT NULL CHECK (status IN ('draft', 'active', 'completed', 'cancelled')) DEFAULT 'draft',
  total_amount DECIMAL(12, 2) NOT NULL,
  paid_amount DECIMAL(12, 2) DEFAULT 0,
  start_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE burials ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Allow authenticated users to access data
CREATE POLICY "Users can view all work orders" ON work_orders
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create work orders" ON work_orders
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update work orders" ON work_orders
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Users can delete work orders" ON work_orders
  FOR DELETE TO authenticated USING (auth.uid() = created_by);

CREATE POLICY "Users can view all grants" ON grants
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create grants" ON grants
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update grants" ON grants
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Users can delete grants" ON grants
  FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- Full access policies for other tables (adjust based on your needs)
CREATE POLICY "Authenticated users have full access to customers" ON customers
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users have full access to inventory" ON inventory
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users have full access to burials" ON burials
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users have full access to contracts" ON contracts
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_work_orders_status ON work_orders(status);
CREATE INDEX IF NOT EXISTS idx_work_orders_created_by ON work_orders(created_by);
CREATE INDEX IF NOT EXISTS idx_work_orders_due_date ON work_orders(due_date);
CREATE INDEX IF NOT EXISTS idx_grants_status ON grants(status);
CREATE INDEX IF NOT EXISTS idx_grants_deadline ON grants(deadline);
CREATE INDEX IF NOT EXISTS idx_customers_name ON customers(last_name, first_name);
CREATE INDEX IF NOT EXISTS idx_burials_burial_date ON burials(burial_date);
CREATE INDEX IF NOT EXISTS idx_contracts_customer ON contracts(customer_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to auto-update updated_at
CREATE TRIGGER update_work_orders_updated_at
  BEFORE UPDATE ON work_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_grants_updated_at
  BEFORE UPDATE ON grants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_updated_at
  BEFORE UPDATE ON inventory
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_burials_updated_at
  BEFORE UPDATE ON burials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contracts_updated_at
  BEFORE UPDATE ON contracts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample data (optional - remove in production)
-- Uncomment to add sample data for testing

/*
INSERT INTO work_orders (title, description, type, priority, status, created_by) VALUES
  ('Lawn maintenance - Section A', 'Weekly mowing and trimming', 'grounds', 'medium', 'pending', auth.uid()),
  ('Repair grave marker - Lot 42', 'Marker has shifted and needs realignment', 'repair', 'high', 'in_progress', auth.uid()),
  ('Prepare burial site - Lot 156', 'Opening for Jones family burial on Friday', 'burial_prep', 'urgent', 'pending', auth.uid());

INSERT INTO grants (title, description, type, source, amount, status, created_by) VALUES
  ('Historic Cemetery Preservation Grant', 'Federal grant for historic site maintenance', 'grant', 'National Trust for Historic Preservation', 25000, 'available', auth.uid()),
  ('Veterans Memorial Fund', 'State funding for veteran section improvements', 'benefit', 'Michigan Dept. of Veterans Affairs', 15000, 'applied', auth.uid());
*/
