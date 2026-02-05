import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Machine, ProductionMetric, OptimizationSuggestion, SustainabilityMetric, ChatMessage, Notification } from '../lib/supabase';
import { MockService } from '../lib/mockData';

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
  scheduleMaintenance: (id: string) => Promise<void>;
  completeMaintenance: (id: string) => Promise<void>;
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
      // Fetch from MockService instead of Supabase
      const [machinesData, metricsData, optimizationsData, sustainabilityData, chatData, notificationsData] = await Promise.all([
        MockService.getMachines(),
        MockService.getProductionMetrics(),
        MockService.getOptimizations(),
        MockService.getSustainabilityMetrics(),
        MockService.getChatMessages(),
        MockService.getNotifications()
      ]);

      setMachines(machinesData);
      setProductionMetrics(metricsData);
      setOptimizations(optimizationsData);
      setSustainabilityMetrics(sustainabilityData);
      setChatMessages(chatData);
      setNotifications(notificationsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const simulateRealtimeUpdates = () => {
    MockService.simulateTick();
    refreshData();
  };

  const sendMessage = async (message: string) => {
    // 1. Save user message to Mock Service
    await MockService.addChatMessage(message, 'user');
    await refreshData();

    try {
      // Prepare system prompt with current state
      const systemPrompt = `You are a Smart Factory AI Assistant. 
      Current System State:
      - Machines: ${JSON.stringify(machines.map(m => ({ name: m.name, status: m.status, efficiency: m.efficiency, issue: m.issue_detected })))}
      - Latest Production Rate: ${productionMetrics[productionMetrics.length - 1]?.production_rate.toFixed(1)} units/hr
      - Active Alerts: ${notifications.filter(n => !n.read && n.type !== 'info').map(n => n.message).join(', ') || 'None'}
      
      User Question: ${message}
      
      Answer concisely based on the real-time data provided above. If a machine has an issue, recommend specific maintenance actions.`;

      // 2. Call Ollama (via local proxy)
      const response = await fetch('/api/ollama/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3', // User can change this model name if they have a different one installed
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.statusText}`);
      }

      const data = await response.json();
      const aiMessage = data.message?.content || 'Sorry, I could not generate a response.';

      // 3. Save assistant response to Mock Service
      await MockService.addChatMessage(aiMessage, 'assistant');
      await refreshData();

    } catch (error) {
      console.error('Error calling Ollama:', error);
      await MockService.addChatMessage('Error: Could not connect to local AI model. Please ensure Ollama is running.', 'assistant');
      await refreshData();
    }
  };

  const approveOptimization = async (id: string) => {
    await MockService.approveOptimization(id);
    await refreshData();
  };

  const rejectOptimization = async (id: string) => {
    await MockService.rejectOptimization(id);
    await refreshData();
  };

  const markNotificationRead = async (id: string) => {
    await MockService.markNotificationRead(id);
    await refreshData();
  };

  const scheduleMaintenance = async (id: string) => {
    await MockService.scheduleMaintenance(id);
    await refreshData();
  };

  const completeMaintenance = async (id: string) => {
    await MockService.completeMaintenance(id);
    await refreshData();
  };

  useEffect(() => {
    refreshData();

    // Run simulation loop every 5 seconds
    const interval = setInterval(simulateRealtimeUpdates, 5000);

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
      markNotificationRead,
      scheduleMaintenance,
      completeMaintenance
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
