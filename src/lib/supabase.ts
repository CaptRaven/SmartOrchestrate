import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Export a dummy client if config is missing, to allow types to be imported without crashing
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      from: () => ({
        select: () => ({ order: () => Promise.resolve({ data: [] }) }),
        insert: () => Promise.resolve({ error: null }),
        update: () => ({ eq: () => Promise.resolve({ error: null }) }),
      })
    } as any;

export interface Machine {
  id: string;
  name: string;
  status: 'operational' | 'warning' | 'critical' | 'maintenance';
  efficiency: number;
  last_maintenance: string;
  next_maintenance: string;
  issue_detected: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductionMetric {
  id: string;
  timestamp: string;
  production_rate: number;
  energy_usage: number;
  efficiency: number;
  created_at: string;
}

export interface OptimizationSuggestion {
  id: string;
  title: string;
  description: string;
  impact: string;
  status: 'pending' | 'approved' | 'rejected' | 'implemented';
  created_at: string;
  approved_at: string | null;
}

export interface SustainabilityMetric {
  id: string;
  timestamp: string;
  co2_reduction: number;
  energy_saved: number;
  efficiency_gain: number;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  message: string;
  role: 'user' | 'assistant';
  created_at: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  created_at: string;
}
