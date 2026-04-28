import { Users, UserX, AlertTriangle, DollarSign, UserCheck } from 'lucide-react';

export default function StatsCard({ title, value, type }: { title: string, value: string | number, type: 'total'|'active'|'expiring'|'revenue'|'trainers' }) {
  const config = {
    total: { icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
    active: { icon: UserCheck, color: 'text-success', bg: 'bg-success/10' },
    expiring: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10' },
    revenue: { icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
    trainers: { icon: UserX, color: 'text-purple-600', bg: 'bg-purple-100' },
  };
  
  const Icon = config[type].icon;

  return (
    <div className="glass-panel p-6 flex items-start space-x-4">
      <div className={`p-4 rounded-xl ${config[type].bg} ${config[type].color}`}>
        <Icon size={24} />
      </div>
      <div>
        <h3 className="text-sm font-medium text-textMuted uppercase tracking-wider">{title}</h3>
        <p className="text-2xl font-bold text-textMain mt-1">
          {type === 'revenue' ? `$${value}` : value}
        </p>
      </div>
    </div>
  );
}
