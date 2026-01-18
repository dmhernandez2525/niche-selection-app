import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../test/test-utils';
import { NicheFinder } from './NicheFinder';

describe('NicheFinder', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the page title', () => {
    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    ));

    render(<NicheFinder />);

    expect(screen.getByText('Niche Finder')).toBeInTheDocument();
  });

  it('renders the description', () => {
    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    ));

    render(<NicheFinder />);

    expect(screen.getByText(/discover profitable content niches/i)).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    vi.stubGlobal('fetch', vi.fn(() =>
      new Promise(() => {}) // Never resolves
    ));

    render(<NicheFinder />);

    // Should show skeleton loaders
    expect(screen.getByText('Top Results')).toBeInTheDocument();
  });

  it('displays error message when API fails', async () => {
    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
      })
    ));

    render(<NicheFinder />);

    await waitFor(() => {
      expect(screen.getByText(/error loading data/i)).toBeInTheDocument();
    });
  });

  it('displays niche results when data loads', async () => {
    const mockData = [
      { keyword: 'gaming', score: 85, competitionScore: 0.7, profitabilityScore: 15.50 },
      { keyword: 'cooking', score: 72, competitionScore: 0.5, profitabilityScore: 12.00 },
    ];

    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      })
    ));

    render(<NicheFinder />);

    await waitFor(() => {
      expect(screen.getByText('gaming')).toBeInTheDocument();
      expect(screen.getByText('cooking')).toBeInTheDocument();
    });
  });

  it('allows user to type in search input', async () => {
    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    ));

    const { user } = render(<NicheFinder />);
    const input = screen.getByPlaceholderText(/enter a seed keyword/i);

    await user.type(input, 'fitness');

    expect(input).toHaveValue('fitness');
  });
});
