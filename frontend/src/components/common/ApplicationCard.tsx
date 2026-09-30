import React from 'react';
import type { LucideIcon } from 'lucide-react';
import type { ApplicationDomain } from '../../types';
import { GlassPanel } from '../glass/GlassPanel';
import { ArrowRight } from 'lucide-react';

interface ApplicationCardProps {
  id: ApplicationDomain;
  title: string;
  icon: LucideIcon;
  description: string;
  metrics: string;
  accentColor: string;
  isSelected?: boolean;
  onSelect: (id: ApplicationDomain) => void;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  id,
  title,
  icon: Icon,
  description,
  metrics,
  accentColor,
  isSelected,
  onSelect,
}) => {
  return (
    <GlassPanel
      variant="card"
      onClick={() => onSelect(id)}
      className={`p-6 cursor-pointer flex flex-col justify-between group transition-all duration-300 ${
        isSelected
          ? 'ring-2 ring-sky-400/80 bg-white/75 shadow-lg backdrop-blur-2xl'
          : 'hover:bg-white/70'
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-2xl bg-white/60 border border-white/80 shadow-sm ${accentColor}`}>
            <Icon className="w-6 h-6" />
          </div>
          <span className={`text-[10px] font-sans font-bold px-2.5 py-0.5 rounded-full border ${
            isSelected
              ? 'bg-sky-500/20 text-sky-900 border-sky-400/40 backdrop-blur-md'
              : 'bg-white/50 text-slate-600 border-white/60'
          }`}>
            {isSelected ? 'SELECTED' : 'DOMAIN'}
          </span>
        </div>

        <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-sky-600 transition-colors">
          {title}
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed mb-4">
          {description}
        </p>
      </div>

      <div className="pt-3 border-t border-slate-200/80 text-[11px] text-slate-500 font-medium flex items-center justify-between font-sans">
        <span>{metrics}</span>
        <ArrowRight className="w-3.5 h-3.5 text-sky-600 group-hover:translate-x-1 transition-transform" />
      </div>
    </GlassPanel>
  );
};
