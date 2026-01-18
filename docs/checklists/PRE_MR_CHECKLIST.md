# Pre-Merge Request Checklist

Complete this checklist before creating a pull request.

---

## Pre-Commit

- [ ] All items from [Pre-Commit Checklist](./PRE_COMMIT_CHECKLIST.md) completed

## Documentation

- [ ] README updated if needed
- [ ] New features documented
- [ ] API changes documented
- [ ] Breaking changes noted

## Testing

- [ ] Unit tests added for new functionality
- [ ] Integration tests added where appropriate
- [ ] Edge cases covered
- [ ] Coverage meets 85% threshold

## Code Review Prep

- [ ] Self-reviewed the diff
- [ ] Removed debug code and comments
- [ ] Variable names are descriptive
- [ ] Complex logic has comments

## PR Description

- [ ] Clear summary of changes
- [ ] Link to related issue (if applicable)
- [ ] Test plan included
- [ ] Screenshots for UI changes

---

## PR Template

```markdown
## Summary
[Brief description of changes]

## Changes
- Change 1
- Change 2

## Test Plan
- [ ] Test case 1
- [ ] Test case 2

## Screenshots
[If applicable]

## Checklist
- [ ] Tests pass
- [ ] Lint passes
- [ ] Documentation updated
```
