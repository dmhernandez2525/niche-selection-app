import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../test/test-utils';
import { Input } from './input';

describe('Input', () => {
  it('renders correctly', () => {
    render(<Input placeholder="Enter text" aria-label="Text input" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('has correct data-slot attribute', () => {
    render(<Input aria-label="Test input" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('data-slot', 'input');
  });

  it('accepts text input', async () => {
    const { user } = render(<Input aria-label="Text input" />);
    const input = screen.getByRole('textbox');

    await user.type(input, 'Hello World');

    expect(input).toHaveValue('Hello World');
  });

  it('supports controlled input', async () => {
    const handleChange = vi.fn();
    const { user } = render(
      <Input value="initial" onChange={handleChange} aria-label="Controlled input" />
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('initial');

    await user.type(input, 'x');

    expect(handleChange).toHaveBeenCalled();
  });

  it('can be disabled', () => {
    render(<Input disabled aria-label="Disabled input" />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('applies custom className', () => {
    render(<Input className="custom-class" aria-label="Custom input" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('custom-class');
  });

  it('supports different input types', () => {
    render(<Input type="email" aria-label="Email input" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'email');
  });

  it('supports password type', () => {
    render(<Input type="password" data-testid="password-input" />);
    const input = screen.getByTestId('password-input');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('supports number type', () => {
    render(<Input type="number" aria-label="Number input" />);
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('type', 'number');
  });

  it('supports required attribute', () => {
    render(<Input required aria-label="Required input" />);
    const input = screen.getByRole('textbox');
    expect(input).toBeRequired();
  });

  it('supports maxLength attribute', () => {
    render(<Input maxLength={10} aria-label="Max length input" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('maxLength', '10');
  });

  it('supports pattern attribute', () => {
    render(<Input pattern="[A-Za-z]+" aria-label="Pattern input" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('pattern', '[A-Za-z]+');
  });

  it('supports readOnly attribute', () => {
    render(<Input readOnly value="Read only" aria-label="Read only input" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('readonly');
  });

  it('handles focus events', async () => {
    const handleFocus = vi.fn();
    const { user } = render(<Input onFocus={handleFocus} aria-label="Focus input" />);

    await user.click(screen.getByRole('textbox'));

    expect(handleFocus).toHaveBeenCalledTimes(1);
  });

  it('handles blur events', async () => {
    const handleBlur = vi.fn();
    const { user } = render(<Input onBlur={handleBlur} aria-label="Blur input" />);

    const input = screen.getByRole('textbox');
    await user.click(input);
    await user.tab();

    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('supports aria-invalid attribute', () => {
    render(<Input aria-invalid="true" aria-label="Invalid input" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });
});
