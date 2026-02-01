import { useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Search,
  BarChart3,
  Bookmark,
  Settings,
  Menu,
  X,
  ChevronRight,
  Play
} from 'lucide-react';

// Check if demo mode is enabled
const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/niche-finder', label: 'Niche Finder', icon: Search },
  { href: '/results', label: 'Results', icon: BarChart3 },
  { href: '/saved', label: 'Saved Searches', icon: Bookmark },
  { href: '/profile', label: 'Settings', icon: Settings },
];

function NavLink({
  href,
  label,
  icon: Icon,
  isActive,
  onClick,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  isActive: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      to={href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all',
        isActive
          ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
          : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <span>{label}</span>
      {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
    </Link>
  );
}

function MobileHeader({
  onMenuClick,
  isOpen,
}: {
  onMenuClick: () => void;
  isOpen: boolean;
}) {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-4 h-14 border-b border-border bg-background md:hidden">
      <Link to="/" className="text-lg font-bold">
        Niche Scout
      </Link>
      <button
        onClick={onMenuClick}
        className="p-2 rounded-lg hover:bg-accent transition-colors"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
    </header>
  );
}

function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const location = useLocation();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-border transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-14 flex items-center px-6 border-b border-sidebar-border md:h-auto md:border-b-0 md:pt-6 md:pb-8">
            <Link to="/" className="text-xl font-bold text-sidebar-foreground">
              Niche Scout
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                isActive={
                  item.href === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(item.href)
                }
                onClick={onClose}
              />
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="px-4 py-3 rounded-lg bg-sidebar-accent/50">
              <p className="text-sm font-medium text-sidebar-foreground">
                Free Plan
              </p>
              <p className="text-xs text-sidebar-foreground/70 mt-1">
                5 analyses remaining
              </p>
              <Link
                to="/profile"
                className="text-xs text-primary hover:underline mt-2 inline-block"
              >
                Upgrade to Pro
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function DemoBanner() {
  if (!isDemoMode) return null;

  return (
    <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-4 py-2 text-center text-sm">
      <div className="flex items-center justify-center gap-2">
        <Play className="h-4 w-4" />
        <span className="font-medium">Demo Mode</span>
        <span className="hidden sm:inline">- Exploring with sample data</span>
        <span className="mx-2 hidden sm:inline">|</span>
        <a href="mailto:hello@example.com" className="underline hover:no-underline">
          Contact us to get started
        </a>
      </div>
    </div>
  );
}

export function AppLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Demo Banner */}
      <DemoBanner />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile Header */}
          <MobileHeader
            onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
            isOpen={isSidebarOpen}
          />

          {/* Page Content */}
          <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
