import { Link, useLocation } from 'react-router-dom';
import { Map, LayoutDashboard, Settings, ChevronLeft, Pill, ShieldAlert, Trophy, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ERNavbarProps {
  showBack?: boolean;
  backTo?: string;
  backLabel?: string;
}

export function ERNavbar({ showBack, backTo = '/dashboard', backLabel = 'Back' }: ERNavbarProps) {
  const location = useLocation();
  
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/rewards', label: 'Rewards', icon: Trophy },
    { path: '/medication-tracker', label: 'Medication', icon: Pill },
    { path: '/impulse-control', label: 'Impulse Control', icon: ShieldAlert },
    { path: '/admin/docs', label: 'Docs', icon: BookOpen },
    { path: '/er-settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-gold/20 bg-night-emerald/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {showBack ? (
              <Link to={backTo}>
                <Button variant="ghost" size="sm" className="text-moon-silver hover:text-emerald-gold gap-1">
                  <ChevronLeft className="w-4 h-4" />
                  {backLabel}
                </Button>
              </Link>
            ) : (
              <Link to="/" className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-gold flex items-center justify-center">
                  <Map className="w-5 h-5 text-night-emerald" />
                </div>
                <span className="text-lg font-bold text-clean-white hidden sm:block">Emerald Road OS</span>
              </Link>
            )}
          </div>
          
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "gap-2",
                      isActive 
                        ? "text-emerald-gold bg-emerald-gold/10" 
                        : "text-moon-silver hover:text-emerald-gold"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
