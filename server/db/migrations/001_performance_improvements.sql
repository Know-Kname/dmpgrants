-- Migration: Performance and Data Integrity Improvements
-- Description: Adds missing indexes, unique constraints, and data integrity rules
-- Date: 2025-12-23

-- Add missing indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_work_orders_created_at ON work_orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_work_orders_due_date ON work_orders(due_date);
CREATE INDEX IF NOT EXISTS idx_burials_created_at ON burials(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_burials_deceased_name ON burials(deceased_last_name, deceased_first_name);
CREATE INDEX IF NOT EXISTS idx_ar_status_due_date ON accounts_receivable(status, due_date);
CREATE INDEX IF NOT EXISTS idx_ap_status_due_date ON accounts_payable(status, due_date);
CREATE INDEX IF NOT EXISTS idx_grants_deadline ON grants(deadline);
CREATE INDEX IF NOT EXISTS idx_grants_type_status ON grants(type, status);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts(status);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_name ON customers(last_name, first_name);

-- Add unique constraint on burial plot locations
-- Prevents double-booking of the same burial plot
ALTER TABLE burials
ADD CONSTRAINT unique_burial_plot UNIQUE (section, lot, grave);

-- Add check constraint to ensure future dates for work order due dates
-- (Only if not already exists - some databases don't support IF NOT EXISTS for constraints)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'work_orders_due_date_check'
    ) THEN
        ALTER TABLE work_orders
        ADD CONSTRAINT work_orders_due_date_check
        CHECK (due_date IS NULL OR due_date >= created_at);
    END IF;
END$$;

-- Add check constraint to ensure non-negative amounts
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'ar_amount_positive'
    ) THEN
        ALTER TABLE accounts_receivable
        ADD CONSTRAINT ar_amount_positive
        CHECK (amount >= 0);
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'ap_amount_positive'
    ) THEN
        ALTER TABLE accounts_payable
        ADD CONSTRAINT ap_amount_positive
        CHECK (amount >= 0);
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'inventory_quantity_check'
    ) THEN
        ALTER TABLE inventory
        ADD CONSTRAINT inventory_quantity_check
        CHECK (quantity >= 0 AND reorder_point >= 0);
    END IF;
END$$;

-- Add foreign key cascades for better data integrity
-- This ensures orphaned records are handled properly

-- Update existing foreign keys to include ON DELETE behaviors
DO $$
BEGIN
    -- Drop and recreate foreign keys with proper cascades
    -- Note: This is idempotent and safe to run multiple times

    -- Work orders: Set NULL on user deletion instead of preventing deletion
    ALTER TABLE work_orders DROP CONSTRAINT IF EXISTS work_orders_assigned_to_fkey;
    ALTER TABLE work_orders
    ADD CONSTRAINT work_orders_assigned_to_fkey
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL;

    ALTER TABLE work_orders DROP CONSTRAINT IF EXISTS work_orders_created_by_fkey;
    ALTER TABLE work_orders
    ADD CONSTRAINT work_orders_created_by_fkey
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL;
END$$;

-- Create partial indexes for common filtered queries
CREATE INDEX IF NOT EXISTS idx_work_orders_pending ON work_orders(created_at DESC)
WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS idx_work_orders_urgent ON work_orders(created_at DESC)
WHERE priority = 'urgent' AND status != 'completed';

CREATE INDEX IF NOT EXISTS idx_ar_overdue ON accounts_receivable(due_date)
WHERE status = 'overdue';

CREATE INDEX IF NOT EXISTS idx_ap_overdue ON accounts_payable(due_date)
WHERE status = 'overdue';

CREATE INDEX IF NOT EXISTS idx_inventory_low_stock ON inventory(name)
WHERE quantity <= reorder_point;

-- Add comments for documentation
COMMENT ON INDEX idx_users_email IS 'Optimizes login queries by email';
COMMENT ON INDEX idx_work_orders_pending IS 'Partial index for pending work orders dashboard';
COMMENT ON INDEX idx_work_orders_urgent IS 'Partial index for urgent work orders requiring attention';
COMMENT ON INDEX idx_inventory_low_stock IS 'Partial index for low stock alerts';
COMMENT ON CONSTRAINT unique_burial_plot ON burials IS 'Prevents double-booking of burial plots';
