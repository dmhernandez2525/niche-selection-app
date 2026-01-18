# Pre-Commit Checklist

Complete this checklist before committing code.

---

## Code Quality

- [ ] No `any` types used
- [ ] No `@ts-ignore` or `@ts-expect-error`
- [ ] No `eslint-disable` comments
- [ ] No `console.log` statements (use proper logging)
- [ ] No hardcoded secrets or API keys

## Testing

- [ ] New code has corresponding tests
- [ ] All tests pass locally (`npm test`)
- [ ] Coverage meets 85% threshold (`npm run test:coverage`)

## Linting & Types

- [ ] ESLint passes (`npm run lint`)
- [ ] TypeScript compiles (`npm run type-check`)
- [ ] No new warnings introduced

## Error Handling

- [ ] All async operations have error handling
- [ ] User-facing errors have meaningful messages
- [ ] Errors are logged appropriately

## Git Hygiene

- [ ] Commit message follows convention: `type(scope): description`
- [ ] Changes are atomic and focused
- [ ] No unrelated changes bundled

---

## Quick Commands

```bash
# Run all checks
npm run lint && npm run type-check && npm test

# Check coverage
npm run test:coverage

# Auto-fix lint issues
npm run lint:fix
```
