/*
  # Create invoices table

  1. New Tables
    - `invoices`
      - `id` (uuid, primary key)
      - `reservation_id` (uuid, foreign key to reservations)
      - `room_total` (numeric)
      - `additional_items` (jsonb)
      - `discount_amount` (numeric, default 0)
      - `tax_rate` (numeric, default 15)
      - `tax_amount` (numeric)
      - `total_amount` (numeric)
      - `notes` (text)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `invoices` table
    - Add policy for authenticated users to manage invoices
*/

CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id uuid REFERENCES reservations(id) ON DELETE CASCADE,
  room_total numeric NOT NULL DEFAULT 0,
  additional_items jsonb DEFAULT '[]'::jsonb,
  discount_amount numeric DEFAULT 0,
  tax_rate numeric DEFAULT 15,
  tax_amount numeric NOT NULL DEFAULT 0,
  total_amount numeric NOT NULL DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to manage invoices"
  ON invoices
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create an index for faster lookups
CREATE INDEX IF NOT EXISTS invoices_reservation_id_idx ON invoices(reservation_id);
CREATE INDEX IF NOT EXISTS invoices_created_at_idx ON invoices(created_at);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_invoices_updated_at 
    BEFORE UPDATE ON invoices 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();