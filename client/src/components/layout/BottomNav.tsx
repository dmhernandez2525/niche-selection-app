import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Search,
  BarChart3,
  Bookmark,
  Settings,
} from 'lucide-react';

const bottomNavItems = [
  { href: '/', label: 'Home', icon: LayoutDashboard },
  { href: '/niche-finder', label: 'Finder', icon: Search },
  { href: '/results', label: 'Results', icon: BarChart3 },
  { href: '/saved', label: 'Saved', icon: Bookmark },
  { href: '/profile', label: 'Settings', icon: Settings },
];

function BottomNavLink({
  href,
  label,
  icon: Icon,
  isActive,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  isActive: boolean;
}) {
  return (
    <Link
      to={href}
      className={cn(
        'flex flex-col items-center justify-center gap-0.5 flex-1 py-2 px-1 rounded-lg transition-colors min-w-0',
        isActive
          ? 'text-primary'
          : 'text-muted-foreground hover:text-foreground'
      )}
    >
      <Icon className={cn('h-5 w-5 shrink-0', isActive && 'stroke-[2.5]')} />
      <span
        className={cn(
          'text-[10px] leading-tight truncate max-w-full',
          isActive ? 'font-semibold' : 'font-medium'
        )}
      >
        {label}
      </span>
    </Link>
  );
}

export function BottomNav() {
  const location = useLocation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden animate-slide-up"
      role="navigation"
      aria-label="Bottom navigation"
    >
      <div className="border-t border-border bg-background/95 backdrop-blur-lg supports-[backdrop-filter]:bg-background/80">
        <div className="flex items-center justify-around px-2 pb-safe">
          {bottomNavItems.map((item) => (
            <BottomNavLink
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              isActive={
                item.href === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.href)
              }
            />
          ))}
        </div>
      </div>
    </nav>
  );
}
