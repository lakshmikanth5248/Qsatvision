import React from 'react';

interface GlassDropdownProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassDropdown: React.FC<GlassDropdownProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`absolute z-30 w-full mt-2 liquid-glass rounded-2xl p-2 shadow-2xl space-y-1 max-h-60 overflow-y-auto ${className}`}>
      {children}
    </div>
  );
};
