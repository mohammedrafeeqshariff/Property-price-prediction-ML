-- ADMINS
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TRAINERS
CREATE TABLE trainers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  specialization VARCHAR(100),
  experience_years INTEGER DEFAULT 0,
  active_clients INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- MEMBERSHIP PLANS
CREATE TABLE membership_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_name VARCHAR(100) NOT NULL,
  duration_days INTEGER NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- MEMBERS
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(150),
  trainer_id UUID REFERENCES trainers(id) ON DELETE SET NULL,
  membership_plan_id UUID REFERENCES membership_plans(id) ON DELETE SET NULL,
  join_date DATE NOT NULL DEFAULT CURRENT_DATE,
  expiry_date DATE,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active','expired','cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_members_trainer ON members(trainer_id);
CREATE INDEX idx_members_plan ON members(membership_plan_id);
CREATE INDEX idx_members_status ON members(status);
CREATE INDEX idx_members_expiry ON members(expiry_date);

-- PAYMENTS
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  payment_method VARCHAR(30) CHECK (payment_method IN ('cash','upi','card','bank_transfer')),
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status VARCHAR(20) DEFAULT 'paid' CHECK (status IN ('paid','pending','overdue')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_payments_member ON payments(member_id);
CREATE INDEX idx_payments_date ON payments(payment_date);

-- MESSAGES
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  message_type VARCHAR(50) CHECK (message_type IN ('renewal_reminder','offer','announcement')),
  channel VARCHAR(30) CHECK (channel IN ('sms','whatsapp','internal')),
  message_text TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'sent' CHECK (status IN ('sent','failed','pending'))
);
CREATE INDEX idx_messages_member ON messages(member_id);

-- REMINDERS
CREATE TABLE reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  reminder_type VARCHAR(50),
  triggered_at TIMESTAMPTZ DEFAULT NOW(),
  resolved BOOLEAN DEFAULT FALSE
);

DO $$
DECLARE
    trainer1 UUID; trainer2 UUID; trainer3 UUID;
    plan_mo UUID; plan_qt UUID; plan_hy UUID; plan_yr UUID;
    member1 UUID; member2 UUID;
BEGIN

    -- ADMIN SEED ('Admin@1234')
    INSERT INTO admins (name, email, password_hash)
    VALUES ('Super Admin', 'admin@gym.com', '$2b$10$WbK.h.K//w2tJtGkL./a.er1N3tK.vA.Y0Iq.j4u.9g/TWe6vI/xO'); 

    -- TRAINERS
    INSERT INTO trainers (name, phone, specialization, experience_years, active_clients)
    VALUES 
    ('John Doe', '1234567890', 'Weightlifting', 5, 3) RETURNING id INTO trainer1;
    INSERT INTO trainers (name, phone, specialization, experience_years, active_clients)
    VALUES
    ('Jane Smith', '0987654321', 'Cardio & HIIT', 3, 3) RETURNING id INTO trainer2;
    INSERT INTO trainers (name, phone, specialization, experience_years, active_clients)
    VALUES
    ('Mike Johnson', '5551234567', 'Yoga', 7, 4) RETURNING id INTO trainer3;

    -- PLANS
    INSERT INTO membership_plans (plan_name, duration_days, price, description)
    VALUES ('Monthly', 30, 50.00, 'Basic monthly membership') RETURNING id INTO plan_mo;
    INSERT INTO membership_plans (plan_name, duration_days, price, description)
    VALUES ('Quarterly', 90, 135.00, 'Basic quarterly membership') RETURNING id INTO plan_qt;
    INSERT INTO membership_plans (plan_name, duration_days, price, description)
    VALUES ('Half Yearly', 180, 250.00, 'Basic half-yearly membership') RETURNING id INTO plan_hy;
    INSERT INTO membership_plans (plan_name, duration_days, price, description)
    VALUES ('Yearly', 365, 480.00, 'Basic yearly membership') RETURNING id INTO plan_yr;

    -- Expiring Soon (1-7 days)
    INSERT INTO members (name, phone, email, trainer_id, membership_plan_id, join_date, expiry_date, status)
    VALUES ('Alice Brown', '111222333', 'alice@example.com', trainer1, plan_mo, CURRENT_DATE - INTERVAL '25 days', CURRENT_DATE + INTERVAL '5 days', 'active') RETURNING id INTO member1;
    
    INSERT INTO members (name, phone, email, trainer_id, membership_plan_id, join_date, expiry_date, status)
    VALUES ('Bob White', '222333444', 'bob@example.com', trainer2, plan_mo, CURRENT_DATE - INTERVAL '28 days', CURRENT_DATE + INTERVAL '2 days', 'active');
    
    -- Expired
    INSERT INTO members (name, phone, email, trainer_id, membership_plan_id, join_date, expiry_date, status)
    VALUES ('Charlie Green', '333444555', 'charlie@example.com', trainer3, plan_mo, CURRENT_DATE - INTERVAL '40 days', CURRENT_DATE - INTERVAL '10 days', 'expired');
    
    -- Active
    INSERT INTO members (name, phone, email, trainer_id, membership_plan_id, join_date, expiry_date, status)
    VALUES ('David Black', '444555666', 'david@example.com', trainer1, plan_yr, CURRENT_DATE - INTERVAL '60 days', CURRENT_DATE + INTERVAL '305 days', 'active');
    
    INSERT INTO members (name, phone, email, trainer_id, membership_plan_id, join_date, expiry_date, status)
    VALUES ('Eve Blue', '555666777', 'eve@example.com', trainer2, plan_hy, CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE + INTERVAL '170 days', 'active');
    
    INSERT INTO members (name, phone, email, trainer_id, membership_plan_id, join_date, expiry_date, status)
    VALUES ('Frank Red', '666777888', 'frank@example.com', trainer3, plan_qt, CURRENT_DATE - INTERVAL '80 days', CURRENT_DATE + INTERVAL '10 days', 'active');

    INSERT INTO members (name, phone, email, trainer_id, membership_plan_id, join_date, expiry_date, status)
    VALUES ('Grace Violet', '777888999', 'grace@example.com', trainer1, plan_mo, CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', 'active');

    -- Cancelled
    INSERT INTO members (name, phone, email, trainer_id, membership_plan_id, join_date, expiry_date, status)
    VALUES ('Harry Indigo', '888999000', 'harry@example.com', NULL, plan_mo, CURRENT_DATE - INTERVAL '100 days', CURRENT_DATE - INTERVAL '70 days', 'cancelled');
    
    -- Two more active mapping to same trainers for count match
    INSERT INTO members (name, phone, email, trainer_id, membership_plan_id, join_date, expiry_date, status)
    VALUES ('Ivy Orange', '999000111', 'ivy@example.com', trainer2, plan_yr, CURRENT_DATE - INTERVAL '20 days', CURRENT_DATE + INTERVAL '345 days', 'active');

    INSERT INTO members (name, phone, email, trainer_id, membership_plan_id, join_date, expiry_date, status)
    VALUES ('Jack Pink', '000111222', 'jack@example.com', trainer3, plan_hy, CURRENT_DATE - INTERVAL '45 days', CURRENT_DATE + INTERVAL '135 days', 'active');

    -- Create some payments
    INSERT INTO payments (member_id, amount, payment_method, payment_date, status)
    VALUES (member1, 50.00, 'card', CURRENT_DATE - INTERVAL '25 days', 'paid');
    
END $$;
