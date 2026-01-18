import type { ReactNode } from 'react';

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar Placeholder */}
      <aside className="w-64 border-r border-border bg-sidebar p-6 hidden md:block">
        <h1 className="text-xl font-bold mb-8 text-sidebar-foreground">Niche Scout</h1>
        <nav className="space-y-2">
            <a href="#" className="block px-4 py-2 rounded-md bg-sidebar-accent text-sidebar-accent-foreground">Dashboard</a>
            <a href="#" className="block px-4 py-2 rounded-md hover:bg-sidebar-accent/50 text-sidebar-foreground/70">Saved Niches</a>
            <a href="#" className="block px-4 py-2 rounded-md hover:bg-sidebar-accent/50 text-sidebar-foreground/70">Settings</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
