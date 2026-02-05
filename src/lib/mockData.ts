import { Machine, ProductionMetric, OptimizationSuggestion, SustainabilityMetric, Notification, ChatMessage } from './supabase';

// Initial Mock Data
let machines: Machine[] = [
  {
    id: '1',
    name: 'Assembly Line A1',
    status: 'operational',
    efficiency: 95.5,
    last_maintenance: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    next_maintenance: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    issue_detected: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Welding Robot B2',
    status: 'warning',
    efficiency: 78.3,
    last_maintenance: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    next_maintenance: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    issue_detected: 'Temperature sensor showing anomalies',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'CNC Machine C3',
    status: 'operational',
    efficiency: 92.1,
    last_maintenance: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    next_maintenance: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
    issue_detected: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Packaging Unit D4',
    status: 'critical',
    efficiency: 45.2,
    last_maintenance: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    next_maintenance: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    issue_detected: 'Hydraulic pressure below threshold',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

let productionMetrics: ProductionMetric[] = Array.from({ length: 12 }).map((_, i) => ({
  id: `pm-${i}`,
  timestamp: new Date(Date.now() - (11 - i) * 3600000).toISOString(),
  production_rate: 850 + Math.random() * 150,
  energy_usage: 220 + Math.random() * 40,
  efficiency: 85 + Math.random() * 10,
  created_at: new Date().toISOString()
}));

let optimizations: OptimizationSuggestion[] = [
  {
    id: '1',
    title: 'Optimize Assembly Line Speed',
    description: 'Increase conveyor speed by 8% during peak hours to maximize throughput',
    impact: 'Expected 12% increase in production rate',
    status: 'pending',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    approved_at: null
  },
  {
    id: '2',
    title: 'Predictive Maintenance Schedule',
    description: 'Shift maintenance window for Welding Robot B2 to minimize downtime',
    impact: 'Reduce downtime by 3 hours per month',
    status: 'pending',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    approved_at: null
  }
];

let sustainabilityMetrics: SustainabilityMetric[] = Array.from({ length: 7 }).map((_, i) => ({
  id: `sm-${i}`,
  timestamp: new Date(Date.now() - (6 - i) * 24 * 3600000).toISOString(),
  co2_reduction: 120 + i * 10 + Math.random() * 20,
  energy_saved: 300 + i * 25 + Math.random() * 50,
  efficiency_gain: 2 + i * 0.3 + Math.random() * 0.5,
  created_at: new Date().toISOString()
}));

let notifications: Notification[] = [
  {
    id: '1',
    title: 'System Update',
    message: 'AI Model updated to version 2.4 with improved anomaly detection.',
    type: 'info',
    read: true,
    created_at: new Date(Date.now() - 24 * 3600000).toISOString()
  },
  {
    id: '2',
    title: 'Critical Alert',
    message: 'Packaging Unit D4 requires immediate maintenance.',
    type: 'error',
    read: false,
    created_at: new Date(Date.now() - 2 * 3600000).toISOString()
  }
];

let chatMessages: ChatMessage[] = [];

// Simulation Logic
export const MockService = {
  getMachines: async () => [...machines],
  getProductionMetrics: async () => [...productionMetrics],
  getOptimizations: async () => [...optimizations],
  getSustainabilityMetrics: async () => [...sustainabilityMetrics],
  getNotifications: async () => [...notifications],
  getChatMessages: async () => [...chatMessages],

  simulateTick: () => {
    // 1. Fluctuate machine efficiency
    machines = machines.map(m => {
      let change = (Math.random() - 0.5) * 5; // +/- 2.5%
      let newEfficiency = Math.max(0, Math.min(100, m.efficiency + change));
      
      // Randomly trigger issues
      let newStatus = m.status;
      let newIssue = m.issue_detected;
      
      if (Math.random() > 0.98 && m.status === 'operational') {
        newStatus = 'warning';
        newIssue = 'Vibration anomaly detected';
        MockService.addNotification({
          title: 'Machine Warning',
          message: `${m.name} is showing vibration anomalies.`,
          type: 'warning'
        });
      } else if (Math.random() > 0.99 && m.status === 'warning') {
        newStatus = 'critical';
        newIssue = 'Component failure imminent';
        MockService.addNotification({
          title: 'Critical Failure Alert',
          message: `${m.name} critical failure detected!`,
          type: 'error'
        });
      }
      
      // Immediate downtime trigger (rare random event)
      if (Math.random() > 0.995 && m.status !== 'maintenance') {
        newStatus = 'critical';
        newEfficiency = 0;
        newIssue = 'Sudden Power Loss / Emergency Stop';
        MockService.addNotification({
          title: 'Emergency Stop',
          message: `${m.name} experienced sudden downtime.`,
          type: 'error'
        });
      }

      return { ...m, efficiency: newEfficiency, status: newStatus, issue_detected: newIssue };
    });

    // 2. Add new production metric point
    const lastMetric = productionMetrics[productionMetrics.length - 1];
    const newMetric: ProductionMetric = {
      id: `pm-${Date.now()}`,
      timestamp: new Date().toISOString(),
      production_rate: Math.max(0, lastMetric.production_rate + (Math.random() - 0.5) * 50),
      energy_usage: Math.max(0, lastMetric.energy_usage + (Math.random() - 0.5) * 20),
      efficiency: Math.max(0, Math.min(100, lastMetric.efficiency + (Math.random() - 0.5) * 5)),
      created_at: new Date().toISOString()
    };
    productionMetrics = [...productionMetrics.slice(1), newMetric]; // Keep window fixed size

    return { machines, productionMetrics };
  },

  addNotification: (notification: Omit<Notification, 'id' | 'created_at' | 'read'>) => {
    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      ...notification,
      read: false,
      created_at: new Date().toISOString()
    };
    notifications = [newNotif, ...notifications];
  },

  approveOptimization: async (id: string) => {
    optimizations = optimizations.map(o => 
      o.id === id ? { ...o, status: 'approved', approved_at: new Date().toISOString() } : o
    );
    MockService.addNotification({
      title: 'Optimization Approved',
      message: 'Optimization has been approved and applied.',
      type: 'success'
    });
  },

  rejectOptimization: async (id: string) => {
    optimizations = optimizations.map(o => 
      o.id === id ? { ...o, status: 'rejected' } : o
    );
  },

  markNotificationRead: async (id: string) => {
    notifications = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
  },

  scheduleMaintenance: async (id: string) => {
    machines = machines.map(m => 
      m.id === id ? { ...m, status: 'maintenance', efficiency: 0, issue_detected: 'Scheduled Maintenance' } : m
    );
    MockService.addNotification({
      title: 'Maintenance Scheduled',
      message: 'Maintenance has been scheduled and started.',
      type: 'info'
    });
  },

  completeMaintenance: async (id: string) => {
    machines = machines.map(m => 
      m.id === id ? { 
        ...m, 
        status: 'operational', 
        efficiency: 100, 
        issue_detected: null, 
        last_maintenance: new Date().toISOString(),
        next_maintenance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      } : m
    );
    MockService.addNotification({
      title: 'Maintenance Completed',
      message: 'Maintenance completed successfully. Machine is back online.',
      type: 'success'
    });
  },

  addChatMessage: async (message: string, role: 'user' | 'assistant') => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      message,
      role,
      created_at: new Date().toISOString()
    };
    chatMessages = [...chatMessages, newMsg];
  }
};
