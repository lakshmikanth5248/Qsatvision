import React from 'react';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'card' | 'control' | 'pill';
  onClick?: () => void;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  className = '',
  variant = 'default',
  onClick,
}) => {
  const variantStyles = {
    default: 'liquid-glass rounded-3xl',
    card: 'liquid-glass-card',
    control: 'liquid-glass-control rounded-2xl',
    pill: 'liquid-glass-pill px-4 py-1.5',
  };

  return (
    <div
      onClick={onClick}
      className={`${variantStyles[variant]} ${className}`}
    >
      {children}
    </div>
  );
};
