-- ============================================
-- 🔐 ONE-TIME EXECUTION GUARD
-- ============================================

CREATE TABLE IF NOT EXISTS _sql_init_guard (
  executed BOOLEAN PRIMARY KEY
);

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM _sql_init_guard WHERE executed = true) THEN
    RAISE NOTICE 'init.sql already executed, skipping';
    RETURN;
  END IF;
END $$;

-- ============================================
-- EXTENSIONS
-- ============================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================
-- 👤 USER
-- ============================================

INSERT INTO users (id, email, name)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'prathmesh@email.com',
  'Prathmesh Gupta'
)
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- 🏦 ACCOUNT
-- ============================================

INSERT INTO accounts (id, user_id, name, type, balance)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  '00000000-0000-0000-0000-000000000001',
  'Primary Bank Account',
  'Savings',
  500000
)
ON CONFLICT DO NOTHING;

-- ============================================
-- 🔁 RECURRING TRANSACTIONS
-- ============================================

INSERT INTO recurring_transactions
(id, user_id, account_id, title, amount, category, frequency, start_date, next_due_date, is_active)
VALUES
(gen_random_uuid(),
 '00000000-0000-0000-0000-000000000001',
 '11111111-1111-1111-1111-111111111111',
 'Salary Credit',
 100000,
 'Income',
 'monthly',
 '2025-11-30',
 '2026-02-28',
 true)
ON CONFLICT DO NOTHING;

-- ============================================
-- 💸 EXPENSES
-- ============================================

INSERT INTO expenses
(id, user_id, account_id, amount, category, payment_method, expense_date, notes, is_auto_generated)
VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 3500, 'Utilities', 'UPI', '2025-11-15', 'Bills', false),
(gen_random_uuid(), '00000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 2000, 'Food', 'Card', '2025-11-20', 'Dining', false);

-- ============================================
-- 🎯 GOAL
-- ============================================

INSERT INTO goals (id, user_id, title, target_amount, target_date)
VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000001',
  'Buy New Bike',
  600000,
  '2026-12-31'
)
ON CONFLICT DO NOTHING;

-- ============================================
-- ✅ MARK SCRIPT AS EXECUTED
-- ============================================

INSERT INTO _sql_init_guard (executed)
VALUES (true)
ON CONFLICT DO NOTHING;
