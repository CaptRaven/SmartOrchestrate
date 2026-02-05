/*
  # SmartOrchestrator Factory Data Schema

  1. New Tables
    - `machines`
      - `id` (uuid, primary key)
      - `name` (text) - Machine name
      - `status` (text) - operational, warning, critical, maintenance
      - `efficiency` (numeric) - Efficiency percentage
      - `last_maintenance` (timestamptz) - Last maintenance date
      - `next_maintenance` (timestamptz) - Scheduled maintenance
      - `issue_detected` (text) - AI detected issue description
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `production_metrics`
      - `id` (uuid, primary key)
      - `timestamp` (timestamptz) - Metric timestamp
      - `production_rate` (numeric) - Units per hour
      - `energy_usage` (numeric) - kWh
      - `efficiency` (numeric) - Overall efficiency percentage
      - `created_at` (timestamptz)

    - `optimization_suggestions`
      - `id` (uuid, primary key)
      - `title` (text) - Suggestion title
      - `description` (text) - Detailed description
      - `impact` (text) - Expected impact description
      - `status` (text) - pending, approved, rejected, implemented
      - `created_at` (timestamptz)
      - `approved_at` (timestamptz)

    - `sustainability_metrics`
      - `id` (uuid, primary key)
      - `timestamp` (timestamptz)
      - `co2_reduction` (numeric) - CO2 reduction in kg
      - `energy_saved` (numeric) - Energy saved in kWh
      - `efficiency_gain` (numeric) - Efficiency gain percentage
      - `created_at` (timestamptz)

    - `ai_chat_messages`
      - `id` (uuid, primary key)
      - `message` (text) - Message content
      - `role` (text) - user or assistant
      - `created_at` (timestamptz)

    - `notifications`
      - `id` (uuid, primary key)
      - `title` (text) - Notification title
      - `message` (text) - Notification message
      - `type` (text) - info, warning, success, error
      - `read` (boolean) - Read status
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public access (demo app, no auth required)
*/

-- Create machines table
CREATE TABLE IF NOT EXISTS machines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  status text NOT NULL DEFAULT 'operational',
  efficiency numeric NOT NULL DEFAULT 100,
  last_maintenance timestamptz DEFAULT now(),
  next_maintenance timestamptz DEFAULT now() + interval '30 days',
  issue_detected text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create production_metrics table
CREATE TABLE IF NOT EXISTS production_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp timestamptz NOT NULL DEFAULT now(),
  production_rate numeric NOT NULL DEFAULT 0,
  energy_usage numeric NOT NULL DEFAULT 0,
  efficiency numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create optimization_suggestions table
CREATE TABLE IF NOT EXISTS optimization_suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  impact text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  approved_at timestamptz
);

-- Create sustainability_metrics table
CREATE TABLE IF NOT EXISTS sustainability_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp timestamptz NOT NULL DEFAULT now(),
  co2_reduction numeric NOT NULL DEFAULT 0,
  energy_saved numeric NOT NULL DEFAULT 0,
  efficiency_gain numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create ai_chat_messages table
CREATE TABLE IF NOT EXISTS ai_chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message text NOT NULL,
  role text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL DEFAULT 'info',
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE machines ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE optimization_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sustainability_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (demo app)
-- Note: In a real production app, you should restrict INSERT/UPDATE to authenticated users only.
-- For this demo, we allow anon access to facilitate easy testing without auth setup.

CREATE POLICY "Allow public read access to machines"
  ON machines FOR SELECT
  TO anon
  USING (true);

-- Allow anon updates for demo interactivity
CREATE POLICY "Allow public insert to machines"
  ON machines FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update to machines"
  ON machines FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public read access to production_metrics"
  ON production_metrics FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert to production_metrics"
  ON production_metrics FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public read access to optimization_suggestions"
  ON optimization_suggestions FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert to optimization_suggestions"
  ON optimization_suggestions FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update to optimization_suggestions"
  ON optimization_suggestions FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public read access to sustainability_metrics"
  ON sustainability_metrics FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert to sustainability_metrics"
  ON sustainability_metrics FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public read access to ai_chat_messages"
  ON ai_chat_messages FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert to ai_chat_messages"
  ON ai_chat_messages FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public read access to notifications"
  ON notifications FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert to notifications"
  ON notifications FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update to notifications"
  ON notifications FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Insert sample data for machines
INSERT INTO machines (name, status, efficiency, issue_detected) VALUES
  ('Assembly Line A1', 'operational', 95.5, NULL),
  ('Welding Robot B2', 'warning', 78.3, 'Temperature sensor showing anomalies'),
  ('CNC Machine C3', 'operational', 92.1, NULL),
  ('Packaging Unit D4', 'critical', 45.2, 'Hydraulic pressure below threshold'),
  ('Quality Check E5', 'maintenance', 0, 'Scheduled maintenance in progress')
ON CONFLICT DO NOTHING;

-- Insert sample production metrics
INSERT INTO production_metrics (timestamp, production_rate, energy_usage, efficiency) VALUES
  (now() - interval '5 hours', 850, 234, 88.5),
  (now() - interval '4 hours', 920, 245, 91.2),
  (now() - interval '3 hours', 895, 238, 89.8),
  (now() - interval '2 hours', 780, 256, 82.1),
  (now() - interval '1 hour', 910, 241, 90.5),
  (now(), 925, 239, 92.0)
ON CONFLICT DO NOTHING;

-- Insert sample optimization suggestions
INSERT INTO optimization_suggestions (title, description, impact, status) VALUES
  ('Optimize Assembly Line Speed', 'Increase conveyor speed by 8% during peak hours to maximize throughput', 'Expected 12% increase in production rate', 'pending'),
  ('Predictive Maintenance Schedule', 'Shift maintenance window for Welding Robot B2 to minimize downtime', 'Reduce downtime by 3 hours per month', 'pending'),
  ('Energy Efficiency Mode', 'Enable smart power management during low-demand periods', 'Save approximately 180 kWh daily', 'approved')
ON CONFLICT DO NOTHING;

-- Insert sample sustainability metrics
INSERT INTO sustainability_metrics (timestamp, co2_reduction, energy_saved, efficiency_gain) VALUES
  (now() - interval '6 days', 125, 340, 2.3),
  (now() - interval '5 days', 142, 385, 3.1),
  (now() - interval '4 days', 138, 368, 2.8),
  (now() - interval '3 days', 156, 412, 3.5),
  (now() - interval '2 days', 149, 395, 3.2),
  (now() - interval '1 day', 162, 428, 3.8),
  (now(), 171, 445, 4.1)
ON CONFLICT DO NOTHING;