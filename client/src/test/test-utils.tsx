import { ReactElement, ReactNode } from 'react';
import { render, RenderOptions, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from '@/context/ToastContext';

// Create a fresh QueryClient for each test
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

// All providers wrapper
interface AllProvidersProps {
  children: ReactNode;
}

function AllProviders({ children }: AllProvidersProps) {
  const queryClient = createTestQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <BrowserRouter>{children}</BrowserRouter>
      </ToastProvider>
    </QueryClientProvider>
  );
}

// Custom render with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  route?: string;
}

function customRender(ui: ReactElement, options?: CustomRenderOptions) {
  const { route = '/', ...renderOptions } = options || {};

  // Set initial route if specified
  window.history.pushState({}, 'Test page', route);

  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: AllProviders, ...renderOptions }),
  };
}

// Re-export everything from testing-library
export * from '@testing-library/react';

// Override render with custom render
export { customRender as render };

// Helper: Wait for loading to finish
export async function waitForLoadingToFinish() {
  await waitFor(
    () => {
      const loadingElements = screen.queryAllByRole('progressbar');
      const spinners = screen.queryAllByTestId(/loading|spinner/i);
      expect([...loadingElements, ...spinners]).toHaveLength(0);
    },
    { timeout: 5000 }
  );
}

// Helper: Mock API response
export function mockApiResponse<T>(data: T, delay = 0): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
}

// Helper: Mock API error
export function mockApiError(message: string, status = 500): Promise<never> {
  return Promise.reject({
    message,
    status,
    response: { data: { error: message } },
  });
}

// Helper: Fill form fields
export async function fillForm(
  user: ReturnType<typeof userEvent.setup>,
  fields: Record<string, string>
) {
  for (const [name, value] of Object.entries(fields)) {
    const input = screen.getByRole('textbox', { name: new RegExp(name, 'i') });
    await user.clear(input);
    await user.type(input, value);
  }
}

// Helper: Submit form
export async function submitForm(
  user: ReturnType<typeof userEvent.setup>,
  buttonText = /submit/i
) {
  const button = screen.getByRole('button', { name: buttonText });
  await user.click(button);
}

// Helper: Wait for modal
export async function waitForModal(title: string, timeout = 3000) {
  await waitFor(
    () => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText(title)).toBeInTheDocument();
    },
    { timeout }
  );
}

// Helper: Check basic accessibility
export function checkAccessibility(container: HTMLElement) {
  // Check for alt text on images
  const images = container.querySelectorAll('img');
  images.forEach((img) => {
    expect(img).toHaveAttribute('alt');
  });

  // Check for labels on form inputs
  const inputs = container.querySelectorAll('input, select, textarea');
  inputs.forEach((input) => {
    const hasLabel =
      input.hasAttribute('aria-label') ||
      input.hasAttribute('aria-labelledby') ||
      container.querySelector(`label[for="${input.id}"]`);
    expect(hasLabel).toBeTruthy();
  });

  // Check for button text
  const buttons = container.querySelectorAll('button');
  buttons.forEach((button) => {
    const hasText =
      button.textContent?.trim() ||
      button.hasAttribute('aria-label') ||
      button.querySelector('svg[aria-label]');
    expect(hasText).toBeTruthy();
  });
}
