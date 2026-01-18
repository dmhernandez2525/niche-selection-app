# Niche Selection App - Coding Standards

**Version:** 1.0.0
**Last Updated:** January 2026

---

## Overview

This document defines mandatory coding patterns for the Niche Selection App. All code must conform to these standards.

---

## Auto-Reject Patterns

**NEVER use these:**

```typescript
any                    // Use specific types
@ts-ignore            // Fix the type error
@ts-expect-error      // Fix the type error
eslint-disable        // Follow lint rules
console.log           // Use proper logging in production
alert()               // Use toast notifications
// TODO:              // Create an issue instead
```

---

## TypeScript Standards

### Type Definitions

```typescript
// GOOD: Explicit types
interface NicheAnalysis {
  id: string;
  keyword: string;
  score: number;
  competition: 'low' | 'medium' | 'high';
  trends: TrendData[];
}

// BAD: Using any
const data: any = fetchData();
```

### Function Signatures

```typescript
// GOOD: Typed parameters and return
function analyzeNiche(keyword: string): Promise<NicheAnalysis> {
  // ...
}

// BAD: Missing types
function analyzeNiche(keyword) {
  // ...
}
```

---

## React Patterns

### Component Structure

```typescript
import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface MyComponentProps {
  title: string;
  items: Item[];
  onSelect?: (item: Item) => void;
  className?: string;
}

export function MyComponent({
  title,
  items,
  onSelect,
  className,
}: MyComponentProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = useCallback((item: Item) => {
    setSelectedId(item.id);
    onSelect?.(item);
  }, [onSelect]);

  return (
    <div className={cn('my-component', className)}>
      <h2>{title}</h2>
      {/* Component content */}
    </div>
  );
}
```

### Custom Hooks

```typescript
// hooks/useNicheAnalysis.ts
import { useQuery } from '@tanstack/react-query';
import { nicheApi } from '@/services/api';

export function useNicheAnalysis(keyword: string) {
  return useQuery({
    queryKey: ['niche', 'analysis', keyword],
    queryFn: () => nicheApi.analyze(keyword),
    enabled: !!keyword,
  });
}
```

---

## API Service Pattern

### Service Structure

```typescript
// services/api/niche.ts
import { apiClient } from './client';

export const nicheApi = {
  analyze: async (keyword: string): Promise<NicheAnalysis> => {
    const response = await apiClient.post('/api/niches/analyze', { keyword });
    return response.data;
  },

  getKeywords: async (niche: string): Promise<Keyword[]> => {
    const response = await apiClient.get(`/api/keywords/${niche}`);
    return response.data;
  },
};
```

---

## Error Handling

### Frontend

```typescript
// Use TanStack Query error handling
const { data, error, isError } = useQuery({...});

if (isError) {
  return <ErrorMessage error={error} />;
}
```

### Backend

```typescript
// controllers/niche.controller.ts
export async function analyzeNiche(req: Request, res: Response) {
  try {
    const { keyword } = req.body;
    const result = await nicheService.analyze(keyword);
    res.json(result);
  } catch (error) {
    console.error('Niche analysis failed:', error);
    res.status(500).json({ error: 'Analysis failed' });
  }
}
```

---

## File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `NicheFinder.tsx` |
| Hooks | camelCase with `use` prefix | `useNicheAnalysis.ts` |
| Utilities | camelCase | `formatDate.ts` |
| Types | PascalCase | `NicheTypes.ts` |
| Tests | Same as source + `.test` | `NicheFinder.test.tsx` |

---

## Testing Standards

### Test Structure

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NicheFinder } from './NicheFinder';

describe('NicheFinder', () => {
  it('renders search input', () => {
    render(<NicheFinder />);
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });

  it('calls onSearch when form is submitted', async () => {
    const onSearch = vi.fn();
    const { user } = render(<NicheFinder onSearch={onSearch} />);

    await user.type(screen.getByRole('searchbox'), 'gaming');
    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(onSearch).toHaveBeenCalledWith('gaming');
  });
});
```

### Coverage Requirements

| Metric | Minimum |
|--------|---------|
| Statements | 85% |
| Branches | 85% |
| Functions | 85% |
| Lines | 85% |

---

## Git Commit Standards

### Format

```
type(scope): description

- Detail 1
- Detail 2
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructure
- `test`: Tests
- `chore`: Maintenance

### Example

```
feat(niche-finder): add keyword suggestions

- Integrate Google Trends API
- Add autocomplete dropdown
- Cache suggestions for 1 hour
```

---

## Pre-Commit Checklist

- [ ] No `any` types
- [ ] No `@ts-ignore` or `eslint-disable`
- [ ] No `console.log` statements
- [ ] All errors handled
- [ ] Tests written and passing
- [ ] Lint passing (`npm run lint`)
- [ ] Type check passing (`npm run type-check`)
- [ ] Coverage meets thresholds
