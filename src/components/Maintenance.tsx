import { Wrench, AlertCircle, CheckCircle, Clock, Brain } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export default function Maintenance() {
  const { machines, loading, scheduleMaintenance, completeMaintenance } = useApp();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading maintenance data...</div>
      </div>
    );
  }

  const statusConfig = {
    operational: {
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      label: 'Operational'
    },
    warning: {
      icon: AlertCircle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      label: 'Warning'
    },
    critical: {
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      label: 'Critical'
    },
    maintenance: {
      icon: Wrench,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      label: 'Under Maintenance'
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Maintenance Management</h1>
        <p className="text-gray-600 mt-1">AI-powered predictive maintenance and machine monitoring</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Machines"
          value={machines.length}
          color="bg-blue-500"
        />
        <StatCard
          label="Operational"
          value={machines.filter(m => m.status === 'operational').length}
          color="bg-green-500"
        />
        <StatCard
          label="Need Attention"
          value={machines.filter(m => m.status === 'warning' || m.status === 'critical').length}
          color="bg-orange-500"
        />
        <StatCard
          label="In Maintenance"
          value={machines.filter(m => m.status === 'maintenance').length}
          color="bg-gray-500"
        />
      </div>

      <div className="space-y-4">
        {machines.map(machine => {
          const config = statusConfig[machine.status];
          const StatusIcon = config.icon;
          const nextMaintenance = new Date(machine.next_maintenance);
          const daysTillMaintenance = Math.ceil((nextMaintenance.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

          return (
            <div key={machine.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${config.bgColor}`}>
                    <StatusIcon className={`w-6 h-6 ${config.color}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{machine.name}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.color} mt-1`}>
                      {config.label}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">{machine.efficiency}%</div>
                  <div className="text-sm text-gray-500">Efficiency</div>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div
                  className={`h-3 rounded-full transition-all ${
                    machine.efficiency >= 90 ? 'bg-green-500' :
                    machine.efficiency >= 70 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${machine.efficiency}%` }}
                />
              </div>

              {machine.issue_detected && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Brain className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-red-900 mb-1">AI Detection</h4>
                      <p className="text-sm text-red-700">{machine.issue_detected}</p>
                      <p className="text-xs text-red-600 mt-2">
                        Recommended action: Schedule immediate inspection and maintenance
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="text-xs text-gray-500">Last Maintenance</div>
                    <div className="text-sm font-medium text-gray-900">
                      {new Date(machine.last_maintenance).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="text-xs text-gray-500">Next Maintenance</div>
                    <div className="text-sm font-medium text-gray-900">
                      {nextMaintenance.toLocaleDateString()} ({daysTillMaintenance} days)
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="text-xs text-gray-500">AI Recommendation</div>
                    <div className="text-sm font-medium text-gray-900">
                      {machine.status === 'critical' ? 'Urgent' :
                       machine.status === 'warning' ? 'Soon' :
                       machine.status === 'maintenance' ? 'In Progress' :
                       'On Schedule'}
                    </div>
                  </div>
                </div>
              </div>

              {(machine.status === 'warning' || machine.status === 'critical') && (
                <div className="mt-4 flex gap-2">
                  <button 
                    onClick={() => scheduleMaintenance(machine.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Schedule Maintenance
                  </button>
                  <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium">
                    View Details
                  </button>
                </div>
              )}

              {machine.status === 'maintenance' && (
                <div className="mt-4 flex gap-2">
                  <button 
                    onClick={() => completeMaintenance(machine.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                  >
                    Complete Maintenance
                  </button>
                  <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium">
                    View Details
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className={`w-12 h-12 ${color} rounded-lg mb-3 flex items-center justify-center`}>
        <span className="text-2xl font-bold text-white">{value}</span>
      </div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}
