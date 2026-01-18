import { describe, it, expect, vi } from 'vitest';
import { render, screen } from './test/test-utils';
import App from './App';

// Mock fetch for the initial query
vi.stubGlobal('fetch', vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })
));

describe('App', () => {
  it('renders the Niche Finder heading', async () => {
    render(<App />);

    expect(screen.getByText('Niche Finder')).toBeInTheDocument();
  });

  it('renders the search input', () => {
    render(<App />);

    expect(screen.getByPlaceholderText(/enter a seed keyword/i)).toBeInTheDocument();
  });

  it('renders the analyze button', () => {
    render(<App />);

    expect(screen.getByRole('button', { name: /analyze/i })).toBeInTheDocument();
  });
});
