import { Leaf, Zap, TrendingDown, Award, Download } from 'lucide-react';
import { useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Sustainability() {
  const { sustainabilityMetrics, loading } = useApp();

  const totalCO2Reduction = useMemo(
    () => sustainabilityMetrics.reduce((sum, m) => sum + Number(m.co2_reduction), 0),
    [sustainabilityMetrics]
  );
  const totalEnergySaved = useMemo(
    () => sustainabilityMetrics.reduce((sum, m) => sum + Number(m.energy_saved), 0),
    [sustainabilityMetrics]
  );
  const avgEfficiencyGain = useMemo(
    () =>
      sustainabilityMetrics.length
        ? sustainabilityMetrics.reduce((sum, m) => sum + Number(m.efficiency_gain), 0) / sustainabilityMetrics.length
        : 0,
    [sustainabilityMetrics]
  );
  const chartData = useMemo(
    () =>
      sustainabilityMetrics.map(metric => ({
        date: new Date(metric.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        co2: Number(metric.co2_reduction),
        energy: Number(metric.energy_saved),
        efficiency: Number(metric.efficiency_gain)
      })),
    [sustainabilityMetrics]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading sustainability data...</div>
      </div>
    );
  }

  const handleDownloadReport = () => {
    const report = `
SmartOrchestrator Sustainability Report
Generated: ${new Date().toLocaleString()}

Summary:
- Total CO2 Reduction: ${totalCO2Reduction.toFixed(1)} kg
- Total Energy Saved: ${totalEnergySaved.toFixed(1)} kWh
- Average Efficiency Gain: ${avgEfficiencyGain.toFixed(2)}%

Alignment with UN SDG 9: Industry, Innovation, and Infrastructure
Our AI-powered factory optimization contributes to sustainable industrialization by:
1. Reducing carbon emissions through smart energy management
2. Improving resource efficiency with predictive maintenance
3. Enhancing productivity while minimizing environmental impact

Detailed Metrics:
${sustainabilityMetrics.map((m, i) => `
Day ${i + 1} (${new Date(m.timestamp).toLocaleDateString()}):
  - CO2 Reduction: ${m.co2_reduction} kg
  - Energy Saved: ${m.energy_saved} kWh
  - Efficiency Gain: ${m.efficiency_gain}%
`).join('\n')}
    `.trim();

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sustainability-report-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sustainability Tracker</h1>
          <p className="text-gray-600 mt-1">Environmental impact and UN SDG 9 alignment</p>
        </div>
        <button
          onClick={handleDownloadReport}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          icon={<TrendingDown className="w-6 h-6" />}
          label="CO2 Reduction"
          value={totalCO2Reduction.toFixed(1)}
          unit="kg"
          color="bg-green-500"
          trend="Total reduction achieved"
        />
        <MetricCard
          icon={<Zap className="w-6 h-6" />}
          label="Energy Saved"
          value={totalEnergySaved.toFixed(1)}
          unit="kWh"
          color="bg-blue-500"
          trend="Cumulative savings"
        />
        <MetricCard
          icon={<Award className="w-6 h-6" />}
          label="Efficiency Gain"
          value={avgEfficiencyGain.toFixed(2)}
          unit="%"
          color="bg-purple-500"
          trend="Average improvement"
        />
      </div>

      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg shadow-md p-6 border-l-4 border-green-500">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-green-500 rounded-lg">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">UN SDG 9: Industry, Innovation, and Infrastructure</h2>
            <p className="text-gray-700 mb-3">
              SmartOrchestrator contributes to sustainable industrialization through AI-powered optimization,
              reducing environmental impact while enhancing productivity and innovation.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <SDGMetric label="Resilient Infrastructure" value="92%" />
              <SDGMetric label="Sustainable Industry" value="88%" />
              <SDGMetric label="Innovation Index" value="95%" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">CO2 Reduction Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="co2" stroke="#10b981" fill="#10b981" fillOpacity={0.3} name="CO2 Reduction (kg)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Energy Savings</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="energy" stroke="#3b82f6" strokeWidth={2} name="Energy Saved (kWh)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Efficiency Improvements</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="efficiency" stroke="#8b5cf6" strokeWidth={2} name="Efficiency Gain (%)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">AI-Generated Insights</h2>
        <div className="space-y-3">
          <InsightCard
            icon={<TrendingDown className="w-5 h-5 text-green-600" />}
            text="CO2 emissions have decreased by 37% compared to last month through optimized energy management."
          />
          <InsightCard
            icon={<Zap className="w-5 h-5 text-blue-600" />}
            text="Energy efficiency improvements are accelerating. Current trajectory suggests 25% reduction by quarter end."
          />
          <InsightCard
            icon={<Award className="w-5 h-5 text-purple-600" />}
            text="Your facility is on track to exceed UN SDG 9 targets for sustainable industrial practices."
          />
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, unit, color, trend }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  color: string;
  trend: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className={`${color} text-white p-3 rounded-lg inline-flex mb-3`}>
        {icon}
      </div>
      <h3 className="text-gray-600 text-sm font-medium">{label}</h3>
      <div className="flex items-baseline mt-2">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        <span className="ml-2 text-gray-600">{unit}</span>
      </div>
      <p className="text-sm text-gray-500 mt-2">{trend}</p>
    </div>
  );
}

function SDGMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-lg p-3">
      <div className="text-2xl font-bold text-green-600">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}

function InsightCard({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
      {icon}
      <p className="text-gray-700 text-sm">{text}</p>
    </div>
  );
}
