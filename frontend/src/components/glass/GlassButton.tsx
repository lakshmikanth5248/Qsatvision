import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium font-sans transition-all duration-200 backdrop-blur-xl disabled:opacity-40 disabled:cursor-not-allowed select-none active:scale-[0.98]";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs rounded-xl gap-1.5",
    md: "px-4 py-2.5 text-xs rounded-2xl gap-2",
    lg: "px-6 py-3.5 text-sm rounded-2xl gap-2.5 font-semibold",
  };

  const variantStyles = {
    primary: "bg-gradient-to-r from-sky-500/90 via-blue-600/90 to-sky-600/90 hover:brightness-105 text-white border border-white/40 shadow-md shadow-sky-500/25 backdrop-blur-xl",
    secondary: "bg-white/55 hover:bg-white/75 text-slate-800 border border-white/80 border-t-white/95 shadow-sm backdrop-blur-xl",
    accent: "bg-gradient-to-r from-purple-500/90 via-indigo-600/90 to-purple-600/90 hover:brightness-105 text-white border border-white/40 shadow-md shadow-purple-500/25 backdrop-blur-xl",
    ghost: "bg-transparent hover:bg-white/50 text-slate-700 hover:text-slate-900 border border-transparent backdrop-blur-md",
    danger: "bg-gradient-to-r from-rose-500/90 to-red-600/90 hover:brightness-105 text-white border border-white/40 shadow-sm backdrop-blur-xl",
  };

  return (
    <button
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
    </button>
  );
};
