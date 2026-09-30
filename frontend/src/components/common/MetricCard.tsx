import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  badge?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  subtitle,
  icon: Icon,
  iconColor = 'text-cyan-400',
  badge
}) => {
  return (
    <div className="bg-space-900/90 border border-space-700/70 hover:border-cyan-500/40 rounded-2xl p-4 transition-all shadow-md group">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-slate-400">{title}</span>
        <div className={`p-2 rounded-xl bg-space-850 group-hover:scale-110 transition-transform ${iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-2xl font-bold font-mono text-white tracking-tight">{value}</span>
        {change && (
          <span className={`text-xs font-semibold font-mono ${
            changeType === 'positive' ? 'text-emerald-400' :
            changeType === 'negative' ? 'text-rose-400' : 'text-slate-400'
          }`}>
            {change}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400">
        {subtitle && <span>{subtitle}</span>}
        {badge && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-space-800 text-cyan-300 font-mono border border-space-700">
            {badge}
          </span>
        )}
      </div>
    </div>
  );
};
