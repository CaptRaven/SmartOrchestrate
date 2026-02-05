import { Activity, Zap, TrendingUp, AlertTriangle } from 'lucide-react';
import { useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Machine } from '../lib/supabase';

export default function Dashboard() {
  const { machines, productionMetrics, loading } = useApp();

  const latestMetric = useMemo(
    () => (productionMetrics.length ? productionMetrics[productionMetrics.length - 1] : undefined),
    [productionMetrics]
  );
  const avgEfficiency = useMemo(
    () => (machines.length ? machines.reduce((sum, m) => sum + m.efficiency, 0) / machines.length : 0),
    [machines]
  );
  const machinesNeedingAttention = useMemo(
    () => machines.filter(m => m.status === 'warning' || m.status === 'critical').length,
    [machines]
  );
  const chartData = useMemo(
    () =>
      productionMetrics.map(metric => ({
        time: new Date(metric.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        production: Number(metric.production_rate),
        energy: Number(metric.energy_usage),
        efficiency: Number(metric.efficiency)
      })),
    [productionMetrics]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Factory Dashboard</h1>
        <p className="text-gray-500 mt-1">Real-time production monitoring and AI insights</p>
      </div>

      {/* Key Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={<TrendingUp className="w-6 h-6" />}
          title="Production Rate"
          value={latestMetric?.production_rate || 0}
          unit="units/hr"
          trend="+5.2%"
          color="bg-blue-600"
        />
        <MetricCard
          icon={<Zap className="w-6 h-6" />}
          title="Energy Usage"
          value={latestMetric?.energy_usage || 0}
          unit="kWh"
          trend="-3.1%"
          color="bg-green-600"
        />
        <MetricCard
          icon={<Activity className="w-6 h-6" />}
          title="Machine Efficiency"
          value={avgEfficiency.toFixed(1)}
          unit="%"
          trend="+2.8%"
          color="bg-purple-600"
        />
        <MetricCard
          icon={<AlertTriangle className="w-6 h-6" />}
          title="Alerts"
          value={machinesNeedingAttention}
          unit="machines"
          trend={machinesNeedingAttention > 0 ? 'Needs attention' : 'All clear'}
          color="bg-orange-600"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold mb-6 text-gray-800">Production Rate Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
              />
              <Line type="monotone" dataKey="production" stroke="#2563eb" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold mb-6 text-gray-800">Energy Consumption</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
              />
              <Area type="monotone" dataKey="energy" stroke="#16a34a" fill="#dcfce7" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Machine Status Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Machine Status Overview</h2>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{machines.length} Machines</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {machines.map(machine => (
            <MachineStatusCard key={machine.id} machine={machine} />
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, title, value, unit, trend, color }: {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  unit: string;
  trend: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className={`${color} text-white p-3 rounded-xl shadow-sm`}>
          {icon}
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
          trend.includes('+') || trend === 'All clear' 
            ? 'bg-green-100 text-green-700' 
            : 'bg-red-100 text-red-700'
        }`}>
          {trend}
        </span>
      </div>
      <div className="mt-4">
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <div className="flex items-baseline mt-1 gap-2">
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <span className="text-sm text-gray-400">{unit}</span>
        </div>
      </div>
    </div>
  );
}

function MachineStatusCard({ machine }: { machine: Machine }) {
  const statusConfig = {
    operational: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', bar: 'bg-green-500' },
    warning: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', bar: 'bg-yellow-500' },
    critical: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', bar: 'bg-red-500' },
    maintenance: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', bar: 'bg-gray-500' }
  };

  const config = statusConfig[machine.status];

  return (
    <div className={`border rounded-xl p-5 ${config.bg} ${config.border} transition-all hover:shadow-md`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">{machine.name}</h3>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${config.bg} ${config.text} border ${config.border}`}>
          {machine.status}
        </span>
      </div>
      
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Efficiency</span>
            <span className="font-medium text-gray-900">{machine.efficiency}%</span>
          </div>
          <div className="w-full bg-white rounded-full h-2.5 border border-gray-100">
            <div
              className={`${config.bar} h-2.5 rounded-full transition-all duration-500`}
              style={{ width: `${machine.efficiency}%` }}
            />
          </div>
        </div>
        
        {machine.issue_detected && (
          <div className="flex items-start gap-2 text-xs text-red-600 bg-white/50 p-2 rounded-lg border border-red-100">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{machine.issue_detected}</span>
          </div>
        )}
      </div>
    </div>
  );
}
