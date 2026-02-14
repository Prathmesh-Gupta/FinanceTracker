CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================
-- 🧹 RESET DATABASE (UNCOMMENT WHEN NEEDED)
-- ============================================
-- Use this ONLY when you want a clean DB

DO $$
BEGIN
   IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='expenses') THEN
      TRUNCATE TABLE expenses RESTART IDENTITY CASCADE;
      TRUNCATE TABLE recurring_transactions RESTART IDENTITY CASCADE;
      TRUNCATE TABLE goals RESTART IDENTITY CASCADE;
      TRUNCATE TABLE accounts RESTART IDENTITY CASCADE;
      TRUNCATE TABLE users RESTART IDENTITY CASCADE;
   END IF;
END $$;


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

-- Salary Credit
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
 true);

-- SIP 1
INSERT INTO recurring_transactions VALUES
(gen_random_uuid(),
 '00000000-0000-0000-0000-000000000001',
 '11111111-1111-1111-1111-111111111111',
 'SIP – Mutual Fund 1',
 -7000,
 'Investment',
 'monthly',
 '2025-11-30',
 '2026-02-28',
 true,
 now());

-- SIP 2
INSERT INTO recurring_transactions VALUES
(gen_random_uuid(),
 '00000000-0000-0000-0000-000000000001',
 '11111111-1111-1111-1111-111111111111',
 'SIP – Mutual Fund 2',
 -7000,
 'Investment',
 'monthly',
 '2025-12-01',
 '2026-03-01',
 true,
 now());

-- RD
INSERT INTO recurring_transactions VALUES
(gen_random_uuid(),
 '00000000-0000-0000-0000-000000000001',
 '11111111-1111-1111-1111-111111111111',
 'Recurring Deposit',
 -10000,
 'Savings',
 'monthly',
 '2025-11-10',
 '2026-03-10',
 true,
 now());

-- ============================================
-- 💸 EXPENSES (FIXED + RANDOM)
-- ============================================

INSERT INTO expenses
(id, user_id, account_id, amount, category, payment_method, expense_date, notes, is_auto_generated)
VALUES

-- NOVEMBER
(gen_random_uuid(), '00000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 3500, 'Utilities', 'UPI', '2025-11-15', 'Bills', false),
(gen_random_uuid(), '00000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 2000, 'Food', 'Card', '2025-11-20', 'Dining', false),
(gen_random_uuid(), '00000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 3000, 'Shopping', 'Card', '2025-11-25', 'Shopping', false),
(gen_random_uuid(), '00000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 450, 'Coffee', 'UPI', '2025-11-03', 'Cafe visit', false),
(gen_random_uuid(), '00000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 1800, 'Groceries', 'Card', '2025-11-08', 'Groceries', false),

-- DECEMBER
(gen_random_uuid(), '00000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 3500, 'Utilities', 'UPI', '2025-12-15', 'Bills', false),
(gen_random_uuid(), '00000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 2000, 'Food', 'Card', '2025-12-20', 'Dining', false),
(gen_random_uuid(), '00000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 3000, 'Shopping', 'Card', '2025-12-25', 'Shopping', false),
(gen_random_uuid(), '00000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 2200, 'Travel', 'Card', '2025-12-02', 'Weekend trip', false),

-- JANUARY
(gen_random_uuid(), '00000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 3500, 'Utilities', 'UPI', '2026-01-15', 'Bills', false),
(gen_random_uuid(), '00000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 2000, 'Food', 'Card', '2026-01-20', 'Dining', false),
(gen_random_uuid(), '00000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 3000, 'Shopping', 'Card', '2026-01-25', 'Shopping', false),
(gen_random_uuid(), '00000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 1200, 'Fuel', 'Card', '2026-01-05', 'Bike fuel', false);

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
);

