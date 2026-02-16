-- Create the reservations table
CREATE TABLE IF NOT EXISTS reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID, -- For future logged-in users
    confirmation_code TEXT UNIQUE NOT NULL,
    
    -- Guest Information
    guest_name TEXT NOT NULL,
    guest_email TEXT NOT NULL,
    guest_phone TEXT NOT NULL,
    
    -- Reservation Details
    party_size INTEGER NOT NULL,
    reservation_date DATE NOT NULL,
    reservation_time TEXT NOT NULL,
    
    -- Special Requests
    special_requests TEXT,
    dietary_notes TEXT,
    
    -- Status
    status TEXT NOT NULL DEFAULT 'pending',
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    cancelled_at TIMESTAMPTZ
);

-- Enable Row Level Security
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public to insert reservations
CREATE POLICY "Enable insert for all users" ON reservations FOR INSERT WITH CHECK (true);

-- Create policy to allow public to select reservations (for dashboard lookup)
CREATE POLICY "Enable select for all users" ON reservations FOR SELECT USING (true);

-- Create policy to allow public to update reservations (for cancellation)
CREATE POLICY "Enable update for all users" ON reservations FOR UPDATE USING (true);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_reservations_email ON reservations(guest_email);
CREATE INDEX IF NOT EXISTS idx_reservations_code ON reservations(confirmation_code);
