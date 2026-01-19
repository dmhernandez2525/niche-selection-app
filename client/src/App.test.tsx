import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock fetch for the initial query
vi.stubGlobal('fetch', vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })
));

describe('App', () => {
  it('renders the Dashboard heading on root route', async () => {
    render(<App />);

    // Dashboard appears in navigation and as page heading, use getAllByText
    const dashboardElements = screen.getAllByText('Dashboard');
    expect(dashboardElements.length).toBeGreaterThanOrEqual(1);
  });

  it('renders navigation with Niche Scout branding', () => {
    render(<App />);

    // Should have Niche Scout in the sidebar/header
    const titles = screen.getAllByText('Niche Scout');
    expect(titles.length).toBeGreaterThanOrEqual(1);
  });

  it('renders navigation links', () => {
    render(<App />);

    // Use getAllByText for elements that appear multiple times
    const nicheFinderElements = screen.getAllByText('Niche Finder');
    const resultsElements = screen.getAllByText('Results');
    const savedSearchesElements = screen.getAllByText('Saved Searches');

    expect(nicheFinderElements.length).toBeGreaterThanOrEqual(1);
    expect(resultsElements.length).toBeGreaterThanOrEqual(1);
    expect(savedSearchesElements.length).toBeGreaterThanOrEqual(1);
  });
});
