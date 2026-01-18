# Code Review Checklist

Use this checklist when reviewing pull requests.

---

## Code Quality

- [ ] Code follows project coding standards
- [ ] No obvious bugs or logic errors
- [ ] Error handling is appropriate
- [ ] No security vulnerabilities (XSS, injection, etc.)

## Design

- [ ] Solution is appropriately simple
- [ ] No over-engineering
- [ ] Follows existing patterns in codebase
- [ ] Components are reusable where appropriate

## Testing

- [ ] Tests cover the changes
- [ ] Tests are meaningful (not just for coverage)
- [ ] Edge cases are tested
- [ ] Tests are readable

## Performance

- [ ] No obvious performance issues
- [ ] Database queries are efficient
- [ ] No unnecessary re-renders (React)
- [ ] Large lists use virtualization

## TypeScript

- [ ] Types are specific (no `any`)
- [ ] Interfaces are well-defined
- [ ] Type safety is maintained

## Documentation

- [ ] Code is self-documenting
- [ ] Complex logic has comments
- [ ] Public APIs are documented

---

## Review Comments

When leaving comments:

1. **Be constructive** - Suggest solutions, not just problems
2. **Be specific** - Point to exact lines
3. **Distinguish severity** - Use prefixes:
   - `nit:` - Minor suggestion
   - `suggestion:` - Recommended improvement
   - `issue:` - Must be fixed
   - `question:` - Seeking clarification

## Approval Criteria

- [ ] No blocking issues
- [ ] All discussions resolved
- [ ] CI/CD passes
- [ ] Ready to merge
