import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/test-utils';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from './card';

describe('Card', () => {
  it('renders children correctly', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('has correct data-slot attribute', () => {
    render(<Card data-testid="card">Content</Card>);
    const card = screen.getByTestId('card');
    expect(card).toHaveAttribute('data-slot', 'card');
  });

  it('applies custom className', () => {
    render(
      <Card className="custom-card" data-testid="card">
        Content
      </Card>
    );
    const card = screen.getByTestId('card');
    expect(card).toHaveClass('custom-card');
  });
});

describe('CardHeader', () => {
  it('renders children correctly', () => {
    render(<CardHeader>Header content</CardHeader>);
    expect(screen.getByText('Header content')).toBeInTheDocument();
  });

  it('has correct data-slot attribute', () => {
    render(<CardHeader data-testid="header">Content</CardHeader>);
    const header = screen.getByTestId('header');
    expect(header).toHaveAttribute('data-slot', 'card-header');
  });

  it('applies custom className', () => {
    render(
      <CardHeader className="custom-header" data-testid="header">
        Content
      </CardHeader>
    );
    const header = screen.getByTestId('header');
    expect(header).toHaveClass('custom-header');
  });
});

describe('CardTitle', () => {
  it('renders children correctly', () => {
    render(<CardTitle>My Title</CardTitle>);
    expect(screen.getByText('My Title')).toBeInTheDocument();
  });

  it('has correct data-slot attribute', () => {
    render(<CardTitle data-testid="title">Title</CardTitle>);
    const title = screen.getByTestId('title');
    expect(title).toHaveAttribute('data-slot', 'card-title');
  });

  it('applies custom className', () => {
    render(
      <CardTitle className="custom-title" data-testid="title">
        Title
      </CardTitle>
    );
    const title = screen.getByTestId('title');
    expect(title).toHaveClass('custom-title');
  });
});

describe('CardDescription', () => {
  it('renders children correctly', () => {
    render(<CardDescription>Description text</CardDescription>);
    expect(screen.getByText('Description text')).toBeInTheDocument();
  });

  it('has correct data-slot attribute', () => {
    render(<CardDescription data-testid="description">Description</CardDescription>);
    const description = screen.getByTestId('description');
    expect(description).toHaveAttribute('data-slot', 'card-description');
  });

  it('applies custom className', () => {
    render(
      <CardDescription className="custom-description" data-testid="description">
        Description
      </CardDescription>
    );
    const description = screen.getByTestId('description');
    expect(description).toHaveClass('custom-description');
  });
});

describe('CardContent', () => {
  it('renders children correctly', () => {
    render(<CardContent>Main content</CardContent>);
    expect(screen.getByText('Main content')).toBeInTheDocument();
  });

  it('has correct data-slot attribute', () => {
    render(<CardContent data-testid="content">Content</CardContent>);
    const content = screen.getByTestId('content');
    expect(content).toHaveAttribute('data-slot', 'card-content');
  });

  it('applies custom className', () => {
    render(
      <CardContent className="custom-content" data-testid="content">
        Content
      </CardContent>
    );
    const content = screen.getByTestId('content');
    expect(content).toHaveClass('custom-content');
  });
});

describe('CardFooter', () => {
  it('renders children correctly', () => {
    render(<CardFooter>Footer content</CardFooter>);
    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });

  it('has correct data-slot attribute', () => {
    render(<CardFooter data-testid="footer">Footer</CardFooter>);
    const footer = screen.getByTestId('footer');
    expect(footer).toHaveAttribute('data-slot', 'card-footer');
  });

  it('applies custom className', () => {
    render(
      <CardFooter className="custom-footer" data-testid="footer">
        Footer
      </CardFooter>
    );
    const footer = screen.getByTestId('footer');
    expect(footer).toHaveClass('custom-footer');
  });
});

describe('CardAction', () => {
  it('renders children correctly', () => {
    render(<CardAction>Action button</CardAction>);
    expect(screen.getByText('Action button')).toBeInTheDocument();
  });

  it('has correct data-slot attribute', () => {
    render(<CardAction data-testid="action">Action</CardAction>);
    const action = screen.getByTestId('action');
    expect(action).toHaveAttribute('data-slot', 'card-action');
  });

  it('applies custom className', () => {
    render(
      <CardAction className="custom-action" data-testid="action">
        Action
      </CardAction>
    );
    const action = screen.getByTestId('action');
    expect(action).toHaveClass('custom-action');
  });
});

describe('Card composition', () => {
  it('renders full card with all components', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
          <CardAction>Action</CardAction>
        </CardHeader>
        <CardContent>Card Content</CardContent>
        <CardFooter>Card Footer</CardFooter>
      </Card>
    );

    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card Description')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('Card Content')).toBeInTheDocument();
    expect(screen.getByText('Card Footer')).toBeInTheDocument();
  });
});
