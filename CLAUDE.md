# CLAUDE.md

This file provides guidance for AI assistants (Claude and others) working with this repository.

## Repository Overview

This is a new, empty repository owned by **nicogaray7**. No application code has been added yet. This CLAUDE.md serves as the foundational document to establish conventions and workflows for future development.

## Repository Status

- **State**: Initial (no application code committed yet)
- **Remote**: `origin` at `nicogaray7/nicogaray`

## Development Workflows

### Branch Strategy

- `main` (or `master`): Stable, production-ready code
- `feature/<name>`: Feature branches
- `fix/<name>`: Bug fix branches

### Commit Conventions

Use clear, imperative commit messages:

```
feat: add user authentication module
fix: resolve null pointer in data parser
docs: update API reference for v2 endpoints
refactor: extract shared validation logic
test: add coverage for edge cases in parser
chore: update dependencies
```

Prefix types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `style`, `perf`

### Pull Request Process

1. Create a feature branch from `main`
2. Make changes with descriptive commits
3. Push and open a PR against `main`
4. Ensure CI checks pass before merging

## AI Assistant Guidelines

### When Analyzing This Codebase

- Read `CLAUDE.md` first for context and conventions
- Check `package.json`, `pyproject.toml`, `Cargo.toml`, or equivalent for project type and dependencies
- Look for existing tests to understand expected behavior before making changes
- Do not create new files unless strictly necessary — prefer editing existing ones

### Code Quality Standards

- Write code that is **correct first**, then readable, then performant
- Keep functions small and focused on a single responsibility
- Avoid over-engineering: implement only what is requested
- Do not add comments to self-explanatory code; only document non-obvious logic
- Do not introduce backwards-compatibility shims or feature flags unless explicitly asked

### Security

- Never hardcode secrets, tokens, or credentials
- Validate all external inputs (user input, API responses, file contents)
- Trust internal code and framework guarantees — do not over-validate
- Follow OWASP top 10 guidelines: avoid SQL injection, XSS, command injection, etc.

### Testing

- Add tests for new features and bug fixes
- Run existing tests before and after making changes to confirm nothing regresses
- Keep tests simple and focused; avoid testing implementation details

## Project Setup (To Be Updated)

Once application code is added, update this section with:

- **Language/Runtime**: e.g., Node.js 20, Python 3.12, Go 1.22
- **Package manager**: e.g., npm, pnpm, pip, cargo
- **Install dependencies**: e.g., `npm install`
- **Run development server**: e.g., `npm run dev`
- **Run tests**: e.g., `npm test`
- **Lint/format**: e.g., `npm run lint`
- **Build**: e.g., `npm run build`

## Directory Structure (To Be Updated)

Once the project structure is established, document it here. Example:

```
/
├── src/           # Application source code
├── tests/         # Test suites
├── docs/          # Documentation
├── scripts/       # Utility scripts
└── CLAUDE.md      # This file
```

## Key Conventions (To Be Updated)

As the codebase grows, document project-specific conventions here:

- Naming conventions (files, functions, variables, classes)
- State management patterns
- API design patterns
- Error handling strategy
- Logging approach
