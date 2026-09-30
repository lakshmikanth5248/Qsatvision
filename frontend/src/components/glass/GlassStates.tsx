import React from 'react';
import { GlassPanel } from './GlassPanel';
import { GlassButton } from './GlassButton';
import { Loader2, AlertCircle, CheckCircle2, SearchX } from 'lucide-react';

interface StateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const LoadingState: React.FC<StateProps> = ({
  title = "Loading Satellite Data",
  description = "Connecting to cloud data archives...",
}) => {
  return (
    <GlassPanel className="p-12 text-center flex flex-col items-center justify-center space-y-4 max-w-md mx-auto">
      <div className="p-4 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-600">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
      <div>
        <h3 className="text-base font-extrabold text-slate-900 mb-1">{title}</h3>
        <p className="text-xs text-slate-600 font-medium">{description}</p>
      </div>
    </GlassPanel>
  );
};

export const EmptyState: React.FC<StateProps> = ({
  title = "No Analysis Executed",
  description = "Select a district and application domain to configure classification and change-detection results.",
  actionText = "Explore Andhra Pradesh",
  onAction,
}) => {
  return (
    <GlassPanel className="p-12 text-center flex flex-col items-center justify-center space-y-4 max-w-lg mx-auto">
      <div className="p-4 rounded-full bg-slate-200/80 border border-slate-300 text-slate-600">
        <SearchX className="w-8 h-8" />
      </div>
      <div>
        <h3 className="text-lg font-extrabold text-slate-900 mb-1">{title}</h3>
        <p className="text-xs text-slate-600 font-medium leading-relaxed max-w-sm mx-auto">{description}</p>
      </div>
      {onAction && actionText && (
        <GlassButton variant="primary" size="md" onClick={onAction}>
          {actionText}
        </GlassButton>
      )}
    </GlassPanel>
  );
};

export const ErrorState: React.FC<StateProps> = ({
  title = "Satellite Layer Error",
  description = "Unable to load requested imagery layer. Please verify timeline selection.",
  actionText = "Retry Layer Connection",
  onAction,
}) => {
  return (
    <GlassPanel className="p-8 text-center flex flex-col items-center justify-center space-y-3 max-w-md mx-auto border-rose-500/30">
      <div className="p-3 rounded-full bg-rose-500/15 text-rose-600">
        <AlertCircle className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-base font-extrabold text-slate-900 mb-1">{title}</h3>
        <p className="text-xs text-slate-600 font-medium">{description}</p>
      </div>
      {onAction && (
        <GlassButton variant="secondary" size="sm" onClick={onAction}>
          {actionText}
        </GlassButton>
      )}
    </GlassPanel>
  );
};

export const SuccessState: React.FC<StateProps> = ({
  title = "Analysis Configured",
  description = "Parameters saved to global analysis context.",
}) => {
  return (
    <GlassPanel className="p-6 flex items-center gap-4 bg-emerald-500/15 border-emerald-500/40">
      <div className="p-2.5 rounded-full bg-emerald-500/25 text-emerald-700 shrink-0">
        <CheckCircle2 className="w-5 h-5" />
      </div>
      <div>
        <h4 className="text-sm font-extrabold text-slate-900">{title}</h4>
        <p className="text-xs text-slate-700 font-medium">{description}</p>
      </div>
    </GlassPanel>
  );
};
