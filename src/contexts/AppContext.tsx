import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, Machine, ProductionMetric, OptimizationSuggestion, SustainabilityMetric, ChatMessage, Notification } from '../lib/supabase';

interface AppContextType {
  machines: Machine[];
  productionMetrics: ProductionMetric[];
  optimizations: OptimizationSuggestion[];
  sustainabilityMetrics: SustainabilityMetric[];
  chatMessages: ChatMessage[];
  notifications: Notification[];
  loading: boolean;
  refreshData: () => Promise<void>;
  sendMessage: (message: string) => Promise<void>;
  approveOptimization: (id: string) => Promise<void>;
  rejectOptimization: (id: string) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [productionMetrics, setProductionMetrics] = useState<ProductionMetric[]>([]);
  const [optimizations, setOptimizations] = useState<OptimizationSuggestion[]>([]);
  const [sustainabilityMetrics, setSustainabilityMetrics] = useState<SustainabilityMetric[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshData = async () => {
    try {
      const [machinesRes, metricsRes, optimizationsRes, sustainabilityRes, chatRes, notificationsRes] = await Promise.all([
        supabase.from('machines').select('*').order('created_at', { ascending: true }),
        supabase.from('production_metrics').select('*').order('timestamp', { ascending: true }),
        supabase.from('optimization_suggestions').select('*').order('created_at', { ascending: false }),
        supabase.from('sustainability_metrics').select('*').order('timestamp', { ascending: true }),
        supabase.from('ai_chat_messages').select('*').order('created_at', { ascending: true }),
        supabase.from('notifications').select('*').order('created_at', { ascending: false })
      ]);

      if (machinesRes.data) setMachines(machinesRes.data);
      if (metricsRes.data) setProductionMetrics(metricsRes.data);
      if (optimizationsRes.data) setOptimizations(optimizationsRes.data);
      if (sustainabilityRes.data) setSustainabilityMetrics(sustainabilityRes.data);
      if (chatRes.data) setChatMessages(chatRes.data);
      if (notificationsRes.data) setNotifications(notificationsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (message: string) => {
    await supabase.from('ai_chat_messages').insert({ message, role: 'user' });

    setTimeout(async () => {
      const response = generateAIResponse(message);
      await supabase.from('ai_chat_messages').insert({ message: response, role: 'assistant' });
      await refreshData();
    }, 1000);
  };

  const generateAIResponse = (userMessage: string): string => {
    const lowerMsg = userMessage.toLowerCase();

    if (lowerMsg.includes('maintenance') || lowerMsg.includes('repair')) {
      return 'I have analyzed the maintenance schedule. The Packaging Unit D4 requires immediate attention due to hydraulic pressure issues. I recommend scheduling maintenance within the next 24 hours to prevent production delays.';
    } else if (lowerMsg.includes('production') || lowerMsg.includes('output')) {
      return 'Current production rate is at 925 units/hour with 92% efficiency. Based on historical data, we can optimize output by adjusting Assembly Line A1 speed during peak hours.';
    } else if (lowerMsg.includes('energy') || lowerMsg.includes('power')) {
      return 'Energy consumption is currently at 239 kWh. I have identified opportunities to reduce usage by 15% through smart power management during low-demand periods. Would you like me to implement these changes?';
    } else if (lowerMsg.includes('sustainability') || lowerMsg.includes('co2')) {
      return 'Great news! We have achieved a 171kg CO2 reduction today, with cumulative energy savings of 445 kWh. Our efficiency improvements are contributing to UN SDG 9 targets.';
    } else if (lowerMsg.includes('optimize') || lowerMsg.includes('improve')) {
      return 'I have 3 optimization suggestions ready for review. The most impactful is enabling Energy Efficiency Mode, which can save 180 kWh daily. Would you like to approve these recommendations?';
    } else if (lowerMsg.includes('report') || lowerMsg.includes('summary')) {
      return 'Generating comprehensive factory report: Overall efficiency at 92%, 4 machines operational, 1 requiring attention, 3 pending optimizations. Sustainability metrics show positive trends across all indicators.';
    } else {
      return 'I am your AI Factory Assistant. I can help with maintenance scheduling, production optimization, energy management, and sustainability tracking. What would you like to know?';
    }
  };

  const approveOptimization = async (id: string) => {
    await supabase
      .from('optimization_suggestions')
      .update({ status: 'approved', approved_at: new Date().toISOString() })
      .eq('id', id);

    await supabase.from('notifications').insert({
      title: 'Optimization Approved',
      message: 'An optimization suggestion has been approved and is being implemented.',
      type: 'success'
    });

    await refreshData();
  };

  const rejectOptimization = async (id: string) => {
    await supabase
      .from('optimization_suggestions')
      .update({ status: 'rejected' })
      .eq('id', id);

    await refreshData();
  };

  const markNotificationRead = async (id: string) => {
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);

    await refreshData();
  };

  useEffect(() => {
    refreshData();

    const interval = setInterval(refreshData, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <AppContext.Provider value={{
      machines,
      productionMetrics,
      optimizations,
      sustainabilityMetrics,
      chatMessages,
      notifications,
      loading,
      refreshData,
      sendMessage,
      approveOptimization,
      rejectOptimization,
      markNotificationRead
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
