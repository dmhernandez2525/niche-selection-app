import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/test-utils';
import { AppLayout } from './AppLayout';

describe('AppLayout', () => {
  it('renders children correctly', () => {
    render(
      <AppLayout>
        <div data-testid="child-content">Test content</div>
      </AppLayout>
    );

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders the sidebar with app title', () => {
    render(
      <AppLayout>
        <div>Content</div>
      </AppLayout>
    );

    // Use getAllByText since there are two instances (sidebar and mobile header)
    const titles = screen.getAllByText('Niche Scout');
    expect(titles.length).toBeGreaterThanOrEqual(1);
  });

  it('renders navigation links', () => {
    render(
      <AppLayout>
        <div>Content</div>
      </AppLayout>
    );

    // Sidebar nav labels
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Saved Searches')).toBeInTheDocument();
    // Settings appears in both sidebar and bottom nav
    const settingsLinks = screen.getAllByText('Settings');
    expect(settingsLinks.length).toBeGreaterThanOrEqual(1);
  });

  it('renders navigation as links', () => {
    render(
      <AppLayout>
        <div>Content</div>
      </AppLayout>
    );

    const dashboardLink = screen.getByText('Dashboard');
    const savedSearchesLink = screen.getByText('Saved Searches');
    // Settings appears in both sidebar and bottom nav, use getAllByText
    const settingsLinks = screen.getAllByText('Settings');

    // Links are wrapped in anchor tags
    expect(dashboardLink.closest('a')).toBeInTheDocument();
    expect(savedSearchesLink.closest('a')).toBeInTheDocument();
    expect(settingsLinks[0].closest('a')).toBeInTheDocument();
  });

  it('renders bottom navigation for mobile', () => {
    const { container } = render(
      <AppLayout>
        <div>Content</div>
      </AppLayout>
    );

    const bottomNav = container.querySelector('nav[aria-label="Bottom navigation"]');
    expect(bottomNav).toBeInTheDocument();
    expect(bottomNav).toHaveClass('md:hidden');
  });

  it('has the correct layout structure', () => {
    const { container } = render(
      <AppLayout>
        <div>Content</div>
      </AppLayout>
    );

    // Check for main layout container
    const mainContainer = container.firstChild;
    expect(mainContainer).toHaveClass('flex');
    expect(mainContainer).toHaveClass('min-h-screen');
  });

  it('renders aside element for sidebar', () => {
    const { container } = render(
      <AppLayout>
        <div>Content</div>
      </AppLayout>
    );

    const aside = container.querySelector('aside');
    expect(aside).toBeInTheDocument();
  });

  it('renders main element for content', () => {
    const { container } = render(
      <AppLayout>
        <div>Content</div>
      </AppLayout>
    );

    const main = container.querySelector('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveClass('flex-1');
  });

  it('applies correct background classes', () => {
    const { container } = render(
      <AppLayout>
        <div>Content</div>
      </AppLayout>
    );

    const mainContainer = container.firstChild;
    expect(mainContainer).toHaveClass('bg-background');
    expect(mainContainer).toHaveClass('text-foreground');
  });

  it('sidebar uses transform for mobile visibility', () => {
    const { container } = render(
      <AppLayout>
        <div>Content</div>
      </AppLayout>
    );

    const aside = container.querySelector('aside');
    // New sidebar uses transform-based visibility with -translate-x-full for hidden state
    expect(aside).toHaveClass('-translate-x-full');
    expect(aside).toHaveClass('md:translate-x-0');
  });

  it('sidebar has fixed width', () => {
    const { container } = render(
      <AppLayout>
        <div>Content</div>
      </AppLayout>
    );

    const aside = container.querySelector('aside');
    expect(aside).toHaveClass('w-64');
  });

  it('renders multiple children', () => {
    render(
      <AppLayout>
        <div data-testid="child-1">First child</div>
        <div data-testid="child-2">Second child</div>
      </AppLayout>
    );

    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
  });

  it('renders mobile header with menu button', () => {
    render(
      <AppLayout>
        <div>Content</div>
      </AppLayout>
    );

    const menuButton = screen.getByRole('button', { name: /open menu/i });
    expect(menuButton).toBeInTheDocument();
  });
});
