import { Lightbulb, ThumbsUp, ThumbsDown, TrendingUp, Check } from 'lucide-react';
import { useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { OptimizationSuggestion } from '../lib/supabase';

export default function Optimization() {
  const { optimizations, approveOptimization, rejectOptimization, loading } = useApp();

  const pendingOptimizations = useMemo(
    () => optimizations.filter(o => o.status === 'pending'),
    [optimizations]
  );
  const approvedOptimizations = useMemo(
    () => optimizations.filter(o => o.status === 'approved' || o.status === 'implemented'),
    [optimizations]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading optimization data...</div>
      </div>
    );
  }

  const impactData = [
    { name: 'Production Rate', current: 925, optimized: 1036 },
    { name: 'Energy Usage', current: 239, optimized: 203 },
    { name: 'Efficiency', current: 92, optimized: 97 },
    { name: 'Downtime (hrs)', current: 12, optimized: 9 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Production Optimization</h1>
        <p className="text-gray-600 mt-1">AI-suggested improvements and process optimizations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          icon={<Lightbulb className="w-6 h-6" />}
          label="Pending Suggestions"
          value={pendingOptimizations.length}
          color="bg-yellow-500"
        />
        <MetricCard
          icon={<Check className="w-6 h-6" />}
          label="Approved"
          value={approvedOptimizations.length}
          color="bg-green-500"
        />
        <MetricCard
          icon={<TrendingUp className="w-6 h-6" />}
          label="Potential Improvement"
          value="15%"
          color="bg-blue-500"
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Projected Impact Analysis</h2>
        <p className="text-gray-600 mb-6">Comparison of current metrics vs. optimized projections</p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={impactData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="current" fill="#94a3b8" name="Current" />
            <Bar dataKey="optimized" fill="#3b82f6" name="After Optimization" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Pending Suggestions</h2>
        <div className="space-y-4">
          {pendingOptimizations.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <Check className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="text-gray-600">No pending optimizations at the moment.</p>
            </div>
          ) : (
            pendingOptimizations.map(optimization => (
              <OptimizationCard
                key={optimization.id}
                optimization={optimization}
                onApprove={() => approveOptimization(optimization.id)}
                onReject={() => rejectOptimization(optimization.id)}
              />
            ))
          )}
        </div>
      </div>

      {approvedOptimizations.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Approved & Implemented</h2>
          <div className="space-y-4">
            {approvedOptimizations.map(optimization => (
              <div key={optimization.id} className="bg-white rounded-lg shadow-md p-6 opacity-75">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Check className="w-5 h-5 text-green-600" />
                      <h3 className="text-lg font-semibold text-gray-900">{optimization.title}</h3>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        {optimization.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{optimization.description}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-gray-700">{optimization.impact}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  Approved: {new Date(optimization.approved_at || optimization.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({ icon, label, value, color }: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className={`${color} text-white p-3 rounded-lg inline-flex mb-3`}>
        {icon}
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}

function OptimizationCard({ optimization, onApprove, onReject }: {
  optimization: OptimizationSuggestion;
  onApprove: () => void;
  onReject: () => void;
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            <h3 className="text-lg font-semibold text-gray-900">{optimization.title}</h3>
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
              AI Suggested
            </span>
          </div>
          <p className="text-gray-600 mb-3">{optimization.description}</p>
          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-900">Impact: {optimization.impact}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t">
        <button
          onClick={onApprove}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          <ThumbsUp className="w-4 h-4" />
          Approve & Implement
        </button>
        <button
          onClick={onReject}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
        >
          <ThumbsDown className="w-4 h-4" />
          Reject
        </button>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        Suggested: {new Date(optimization.created_at).toLocaleString()}
      </div>
    </div>
  );
}
