import { cn } from '@/lib/utils';

interface MeterWidgetProps {
  label: string;
  value: number;
  maxValue?: number;
  icon?: React.ReactNode;
  className?: string;
}

export function MeterWidget({ label, value, maxValue = 100, icon, className }: MeterWidgetProps) {
  const percentage = Math.min(100, (value / maxValue) * 100);
  
  return (
    <div className={cn("p-4 rounded-xl bg-dark-emerald border border-emerald-gold/20", className)}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon && <span className="text-emerald-gold">{icon}</span>}
          <span className="text-sm font-medium text-moon-silver">{label}</span>
        </div>
        <span className="text-sm font-bold text-emerald-gold">{value}/{maxValue}</span>
      </div>
      
      <div className="h-2 bg-night-emerald rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-emerald-gold/80 to-emerald-gold rounded-full transition-all duration-700 ease-out"
          style={{ 
            width: `${percentage}%`,
            boxShadow: percentage > 0 ? '0 0 10px hsla(51, 80%, 45%, 0.5)' : 'none'
          }}
        />
      </div>
    </div>
  );
}
