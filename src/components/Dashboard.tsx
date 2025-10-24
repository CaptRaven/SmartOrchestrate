import { Activity, Zap, TrendingUp, AlertTriangle } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { machines, productionMetrics, loading } = useApp();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  const latestMetric = productionMetrics[productionMetrics.length - 1];
  const avgEfficiency = machines.reduce((sum, m) => sum + m.efficiency, 0) / machines.length;
  const machinesNeedingAttention = machines.filter(m => m.status === 'warning' || m.status === 'critical').length;

  const chartData = productionMetrics.map(metric => ({
    time: new Date(metric.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    production: metric.production_rate,
    energy: metric.energy_usage,
    efficiency: metric.efficiency
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Factory Dashboard</h1>
        <p className="text-gray-600 mt-1">Real-time production monitoring and AI insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={<TrendingUp className="w-6 h-6" />}
          title="Production Rate"
          value={latestMetric?.production_rate || 0}
          unit="units/hr"
          trend="+5.2%"
          color="bg-blue-500"
        />
        <MetricCard
          icon={<Zap className="w-6 h-6" />}
          title="Energy Usage"
          value={latestMetric?.energy_usage || 0}
          unit="kWh"
          trend="-3.1%"
          color="bg-green-500"
        />
        <MetricCard
          icon={<Activity className="w-6 h-6" />}
          title="Machine Efficiency"
          value={avgEfficiency.toFixed(1)}
          unit="%"
          trend="+2.8%"
          color="bg-purple-500"
        />
        <MetricCard
          icon={<AlertTriangle className="w-6 h-6" />}
          title="Alerts"
          value={machinesNeedingAttention}
          unit="machines"
          trend={machinesNeedingAttention > 0 ? 'Needs attention' : 'All clear'}
          color="bg-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Production Rate Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="production" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Energy Consumption</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="energy" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Overall Efficiency</h2>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis domain={[70, 100]} />
            <Tooltip />
            <Line type="monotone" dataKey="efficiency" stroke="#8b5cf6" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Machine Status Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div className={`${color} text-white p-3 rounded-lg`}>
          {icon}
        </div>
      </div>
      <h3 className="text-gray-600 text-sm font-medium mt-4">{title}</h3>
      <div className="flex items-baseline mt-2">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        <span className="ml-2 text-gray-600">{unit}</span>
      </div>
      <p className="text-sm text-gray-500 mt-2">{trend}</p>
    </div>
  );
}

function MachineStatusCard({ machine }: { machine: any }) {
  const statusColors = {
    operational: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    critical: 'bg-red-100 text-red-800',
    maintenance: 'bg-gray-100 text-gray-800'
  };

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">{machine.name}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[machine.status]}`}>
          {machine.status}
        </span>
      </div>
      <div className="space-y-1 text-sm text-gray-600">
        <p>Efficiency: {machine.efficiency}%</p>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all"
            style={{ width: `${machine.efficiency}%` }}
          />
        </div>
      </div>
    </div>
  );
}
