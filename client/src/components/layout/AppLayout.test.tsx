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

    expect(screen.getByText('Niche Scout')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(
      <AppLayout>
        <div>Content</div>
      </AppLayout>
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Saved Niches')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders navigation as links', () => {
    render(
      <AppLayout>
        <div>Content</div>
      </AppLayout>
    );

    const dashboardLink = screen.getByText('Dashboard');
    const savedNichesLink = screen.getByText('Saved Niches');
    const settingsLink = screen.getByText('Settings');

    expect(dashboardLink.tagName).toBe('A');
    expect(savedNichesLink.tagName).toBe('A');
    expect(settingsLink.tagName).toBe('A');
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
    expect(main).toHaveClass('p-8');
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

  it('sidebar has hidden class for mobile', () => {
    const { container } = render(
      <AppLayout>
        <div>Content</div>
      </AppLayout>
    );

    const aside = container.querySelector('aside');
    expect(aside).toHaveClass('hidden');
    expect(aside).toHaveClass('md:block');
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
});
