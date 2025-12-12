/*
  # Smart Campus Admin - Complete Database Schema

  ## Overview
  This migration creates the complete database schema for the Smart Campus Admin system,
  including user management, campus facilities, emergency response, and communication systems.

  ## 1. New Tables

  ### User Management
    - `profiles` - Extended user profile information
      - `id` (uuid, references auth.users)
      - `role` (text) - admin, staff, student, security
      - `full_name` (text)
      - `phone` (text)
      - `department` (text)
      - `avatar_url` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  ### Campus Management
    - `buildings` - Campus buildings
      - `id` (uuid, primary key)
      - `name` (text)
      - `code` (text, unique)
      - `description` (text)
      - `address` (text)
      - `floors` (integer)
      - `total_rooms` (integer)
      - `latitude` (numeric)
      - `longitude` (numeric)
      - `status` (text) - active, maintenance, closed
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `facilities` - Campus facilities (labs, libraries, cafeterias)
      - `id` (uuid, primary key)
      - `building_id` (uuid, references buildings)
      - `name` (text)
      - `type` (text) - lab, library, cafeteria, gym, auditorium, parking
      - `floor` (integer)
      - `capacity` (integer)
      - `status` (text) - available, occupied, maintenance
      - `amenities` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `rooms` - Individual rooms
      - `id` (uuid, primary key)
      - `building_id` (uuid, references buildings)
      - `facility_id` (uuid, references facilities, nullable)
      - `room_number` (text)
      - `name` (text)
      - `type` (text) - classroom, office, lab, storage
      - `floor` (integer)
      - `capacity` (integer)
      - `area_sqm` (numeric)
      - `status` (text) - available, occupied, maintenance
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `assets` - Campus assets and equipment
      - `id` (uuid, primary key)
      - `room_id` (uuid, references rooms, nullable)
      - `building_id` (uuid, references buildings, nullable)
      - `name` (text)
      - `asset_code` (text, unique)
      - `category` (text) - furniture, equipment, it, vehicle
      - `description` (text)
      - `purchase_date` (date)
      - `purchase_cost` (numeric)
      - `current_value` (numeric)
      - `status` (text) - active, maintenance, retired
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  ### Emergency Management
    - `emergencies` - Emergency incidents
      - `id` (uuid, primary key)
      - `title` (text)
      - `type` (text) - fire, medical, security, natural_disaster, other
      - `severity` (text) - low, medium, high, critical
      - `status` (text) - active, resolved, investigating
      - `description` (text)
      - `location` (text)
      - `building_id` (uuid, references buildings, nullable)
      - `latitude` (numeric)
      - `longitude` (numeric)
      - `reported_by` (uuid, references auth.users)
      - `assigned_to` (uuid, references auth.users, nullable)
      - `reported_at` (timestamptz)
      - `resolved_at` (timestamptz, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `incident_reports` - Detailed incident reports
      - `id` (uuid, primary key)
      - `emergency_id` (uuid, references emergencies)
      - `reporter_id` (uuid, references auth.users)
      - `description` (text)
      - `actions_taken` (text)
      - `casualties` (integer)
      - `property_damage` (numeric)
      - `attachments` (jsonb)
      - `created_at` (timestamptz)

    - `response_teams` - Emergency response teams
      - `id` (uuid, primary key)
      - `name` (text)
      - `type` (text) - medical, fire, security, evacuation
      - `status` (text) - available, deployed, off_duty
      - `contact_number` (text)
      - `created_at` (timestamptz)

    - `team_members` - Response team members
      - `id` (uuid, primary key)
      - `team_id` (uuid, references response_teams)
      - `user_id` (uuid, references auth.users)
      - `role` (text) - leader, member
      - `created_at` (timestamptz)

  ### Communication
    - `notifications` - User notifications
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `title` (text)
      - `message` (text)
      - `type` (text) - info, warning, alert, success
      - `priority` (text) - low, medium, high
      - `read` (boolean)
      - `read_at` (timestamptz, nullable)
      - `link` (text, nullable)
      - `created_at` (timestamptz)

    - `broadcasts` - Campus-wide broadcasts
      - `id` (uuid, primary key)
      - `title` (text)
      - `message` (text)
      - `type` (text) - announcement, emergency, event, maintenance
      - `priority` (text) - low, medium, high, urgent
      - `target_audience` (text) - all, students, staff, specific
      - `target_roles` (jsonb)
      - `sent_by` (uuid, references auth.users)
      - `scheduled_at` (timestamptz, nullable)
      - `sent_at` (timestamptz, nullable)
      - `expires_at` (timestamptz, nullable)
      - `status` (text) - draft, scheduled, sent, expired
      - `created_at` (timestamptz)

  ### Analytics
    - `audit_logs` - System audit trail
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users, nullable)
      - `action` (text)
      - `resource_type` (text)
      - `resource_id` (text)
      - `changes` (jsonb)
      - `ip_address` (text)
      - `user_agent` (text)
      - `created_at` (timestamptz)

  ## 2. Security
    - Enable RLS on all tables
    - Create policies for role-based access:
      - Admins: Full access to all resources
      - Staff: Read/write access to their department resources
      - Students: Read access to public resources
      - Security: Full access to emergency management

  ## 3. Important Notes
    - All tables use UUIDs as primary keys for better scalability
    - Timestamps use `timestamptz` for timezone awareness
    - Status fields use text enums for flexibility
    - JSONB fields for flexible metadata storage
    - Comprehensive foreign key relationships for data integrity
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'student' CHECK (role IN ('admin', 'staff', 'student', 'security')),
  full_name text NOT NULL,
  phone text,
  department text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert profiles"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- 2. BUILDINGS TABLE
CREATE TABLE IF NOT EXISTS buildings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  description text,
  address text,
  floors integer DEFAULT 1,
  total_rooms integer DEFAULT 0,
  latitude numeric,
  longitude numeric,
  status text DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'closed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE buildings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view buildings"
  ON buildings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and staff can manage buildings"
  ON buildings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'staff')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'staff')
    )
  );

-- 3. FACILITIES TABLE
CREATE TABLE IF NOT EXISTS facilities (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  building_id uuid REFERENCES buildings(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('lab', 'library', 'cafeteria', 'gym', 'auditorium', 'parking')),
  floor integer DEFAULT 0,
  capacity integer DEFAULT 0,
  status text DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'maintenance')),
  amenities jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view facilities"
  ON facilities FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and staff can manage facilities"
  ON facilities FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'staff')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'staff')
    )
  );

-- 4. ROOMS TABLE
CREATE TABLE IF NOT EXISTS rooms (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  building_id uuid REFERENCES buildings(id) ON DELETE CASCADE,
  facility_id uuid REFERENCES facilities(id) ON DELETE SET NULL,
  room_number text NOT NULL,
  name text,
  type text DEFAULT 'classroom' CHECK (type IN ('classroom', 'office', 'lab', 'storage')),
  floor integer DEFAULT 0,
  capacity integer DEFAULT 0,
  area_sqm numeric DEFAULT 0,
  status text DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'maintenance')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(building_id, room_number)
);

ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view rooms"
  ON rooms FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and staff can manage rooms"
  ON rooms FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'staff')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'staff')
    )
  );

-- 5. ASSETS TABLE
CREATE TABLE IF NOT EXISTS assets (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id uuid REFERENCES rooms(id) ON DELETE SET NULL,
  building_id uuid REFERENCES buildings(id) ON DELETE SET NULL,
  name text NOT NULL,
  asset_code text UNIQUE NOT NULL,
  category text NOT NULL CHECK (category IN ('furniture', 'equipment', 'it', 'vehicle')),
  description text,
  purchase_date date,
  purchase_cost numeric DEFAULT 0,
  current_value numeric DEFAULT 0,
  status text DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'retired')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view assets"
  ON assets FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and staff can manage assets"
  ON assets FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'staff')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'staff')
    )
  );

-- 6. EMERGENCIES TABLE
CREATE TABLE IF NOT EXISTS emergencies (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  type text NOT NULL CHECK (type IN ('fire', 'medical', 'security', 'natural_disaster', 'other')),
  severity text NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status text DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'investigating')),
  description text NOT NULL,
  location text,
  building_id uuid REFERENCES buildings(id) ON DELETE SET NULL,
  latitude numeric,
  longitude numeric,
  reported_by uuid REFERENCES auth.users(id),
  assigned_to uuid REFERENCES auth.users(id),
  reported_at timestamptz DEFAULT now(),
  resolved_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE emergencies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view emergencies"
  ON emergencies FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can report emergencies"
  ON emergencies FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reported_by);

CREATE POLICY "Admins and security can manage emergencies"
  ON emergencies FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'security')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'security')
    )
  );

-- 7. INCIDENT REPORTS TABLE
CREATE TABLE IF NOT EXISTS incident_reports (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  emergency_id uuid REFERENCES emergencies(id) ON DELETE CASCADE,
  reporter_id uuid REFERENCES auth.users(id),
  description text NOT NULL,
  actions_taken text,
  casualties integer DEFAULT 0,
  property_damage numeric DEFAULT 0,
  attachments jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE incident_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view incident reports"
  ON incident_reports FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and security can manage incident reports"
  ON incident_reports FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'security')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'security')
    )
  );

-- 8. RESPONSE TEAMS TABLE
CREATE TABLE IF NOT EXISTS response_teams (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('medical', 'fire', 'security', 'evacuation')),
  status text DEFAULT 'available' CHECK (status IN ('available', 'deployed', 'off_duty')),
  contact_number text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE response_teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view response teams"
  ON response_teams FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and security can manage response teams"
  ON response_teams FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'security')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'security')
    )
  );

-- 9. TEAM MEMBERS TABLE
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id uuid REFERENCES response_teams(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role text DEFAULT 'member' CHECK (role IN ('leader', 'member')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(team_id, user_id)
);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view team members"
  ON team_members FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage team members"
  ON team_members FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- 10. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'info' CHECK (type IN ('info', 'warning', 'alert', 'success')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  read boolean DEFAULT false,
  read_at timestamptz,
  link text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can create notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'staff')
    )
  );

-- 11. BROADCASTS TABLE
CREATE TABLE IF NOT EXISTS broadcasts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL CHECK (type IN ('announcement', 'emergency', 'event', 'maintenance')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  target_audience text DEFAULT 'all' CHECK (target_audience IN ('all', 'students', 'staff', 'specific')),
  target_roles jsonb DEFAULT '[]'::jsonb,
  sent_by uuid REFERENCES auth.users(id),
  scheduled_at timestamptz,
  sent_at timestamptz,
  expires_at timestamptz,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sent', 'expired')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE broadcasts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view sent broadcasts"
  ON broadcasts FOR SELECT
  TO authenticated
  USING (status = 'sent' OR status = 'expired');

CREATE POLICY "Admins can manage broadcasts"
  ON broadcasts FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'staff')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'staff')
    )
  );

-- 12. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id text,
  changes jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view audit logs"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_buildings_status ON buildings(status);
CREATE INDEX IF NOT EXISTS idx_facilities_building_id ON facilities(building_id);
CREATE INDEX IF NOT EXISTS idx_facilities_type ON facilities(type);
CREATE INDEX IF NOT EXISTS idx_rooms_building_id ON rooms(building_id);
CREATE INDEX IF NOT EXISTS idx_emergencies_status ON emergencies(status);
CREATE INDEX IF NOT EXISTS idx_emergencies_severity ON emergencies(severity);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_broadcasts_status ON broadcasts(status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_buildings_updated_at BEFORE UPDATE ON buildings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_facilities_updated_at BEFORE UPDATE ON facilities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON rooms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON assets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_emergencies_updated_at BEFORE UPDATE ON emergencies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();