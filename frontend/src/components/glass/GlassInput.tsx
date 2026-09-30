import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon;
  clearable?: boolean;
  onClear?: () => void;
}

export const GlassInput: React.FC<GlassInputProps> = ({
  icon: Icon,
  clearable,
  onClear,
  className = '',
  value,
  ...props
}) => {
  return (
    <div className="relative flex items-center w-full">
      {Icon && (
        <Icon className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
      )}
      <input
        value={value}
        className={`w-full bg-white/50 backdrop-blur-xl border border-white/80 focus:border-sky-500 focus:bg-white/75 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 shadow-sm transition-all ${
          Icon ? 'pl-10' : 'pl-4'
        } ${clearable && value ? 'pr-9' : 'pr-4'} py-2.5 ${className}`}
        {...props}
      />
      {clearable && value && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3 text-slate-400 hover:text-white text-xs font-bold p-1 rounded-full hover:bg-white/10"
        >
          ✕
        </button>
      )}
    </div>
  );
};
