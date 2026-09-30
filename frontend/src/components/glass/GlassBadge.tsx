import React from 'react';

interface GlassBadgeProps {
  children: React.ReactNode;
  variant?: 'demo' | 'info' | 'success' | 'warning' | 'quantum' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
}

export const GlassBadge: React.FC<GlassBadgeProps> = ({
  children,
  variant = 'demo',
  size = 'md',
  className = '',
}) => {
  const variantStyles = {
    demo: 'bg-amber-500/15 border-amber-500/40 text-amber-900 font-mono font-bold',
    info: 'bg-sky-500/15 border-sky-500/40 text-sky-900 font-sans font-bold',
    success: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-900 font-sans font-bold',
    warning: 'bg-orange-500/15 border-orange-500/40 text-orange-900 font-sans font-bold',
    quantum: 'bg-purple-500/15 border-purple-500/40 text-purple-900 font-mono font-bold',
    neutral: 'bg-slate-200/80 border-slate-300 text-slate-800 font-sans font-medium',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px] rounded-md border',
    md: 'px-2.5 py-1 text-xs rounded-xl border backdrop-blur-md',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};

export const DemoDataBadge: React.FC<{ text?: string; className?: string }> = ({
  text = "DEMO DATA",
  className = ""
}) => {
  return (
    <GlassBadge variant="demo" size="md" className={className}>
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
      <span>{text}</span>
    </GlassBadge>
  );
};
