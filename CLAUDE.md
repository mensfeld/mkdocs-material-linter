# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

mkdocs-material-linter is a markdownlint-cli2 plugin that provides custom rules for validating Material for MkDocs markdown syntax. The package integrates with markdownlint-cli2's `customRules` system to lint Material-specific syntax like admonitions, content tabs, and code annotations.

## Development Commands

### Core Commands
- `npm test` - Run all tests using the custom test runner in `test/run-tests.js`
- `npm run lint` - Run ESLint on all JavaScript files

### Testing Workflow
- The project uses a custom test framework (not Jest/Mocha)
- Tests are located in `test/run-tests.js` and individual rule tests in `test/rules/`
- Test fixtures should be organized in `test/fixtures/valid/` and `test/fixtures/invalid/`
- Run individual rule tests: `node test/rules/test-[rule-name].js`

## Architecture

### Main Entry Point
- `index.js` - Exports an array of all custom rules for markdownlint-cli2
- Each rule is required from `lib/rules/[rule-name].js`

### Directory Structure
```
lib/
├── helpers/          # Shared utilities for Material syntax parsing
│   ├── material-parser.js    # Material for MkDocs syntax parsing helpers
│   └── fix-generators.js     # Auto-fix generation utilities
└── rules/           # Individual markdownlint rules
    ├── admonition-types.js           # Validates admonition type names
    ├── admonition-indentation.js     # Enforces 4-space indentation
    ├── code-annotations.js           # Validates code annotation comments
    ├── content-tabs.js              # Validates content tab syntax
    └── navigation-structure.js      # Navigation hierarchy validation
```

### Rule Implementation Pattern
Each rule in `lib/rules/` must export:
- `names`: Array of rule names/aliases
- `description`: User-facing rule description
- `tags`: Array including `material-mkdocs` and severity level
- `parser`: Usually `"micromark"`
- `function`: Implementation function using markdownlint-rule-helpers

### Material for MkDocs Syntax Patterns

**Admonitions** - Must use supported types and 4-space indentation:
```markdown
!!! note "Optional title"
    Content indented with 4 spaces

??? tip "Collapsible"
    Hidden content with 4 spaces
```

**Content Tabs** - Must use `===` delimiters and proper structure:
```markdown
=== "Tab 1"
    Content for tab 1

=== "Tab 2"
    Content for tab 2
```

**Code Annotations** - Comment style must match language:
```python
print("Hello")  # (1)!  # Python uses #
```

```javascript
console.log("Hello");  // (1)!  # JavaScript uses //
```

## Dependencies
- `markdownlint-rule-helpers`: Core utilities for rule implementation
- `markdownlint` (peer dependency): >=0.30.0 for compatibility

## Testing Strategy
- Custom test runner validates rules against fixture files
- Valid fixtures should pass all rules (no errors)
- Invalid fixtures should trigger specific rule violations
- Each rule should have comprehensive test coverage in `test/rules/`

## Integration Usage
The package is designed to work with markdownlint-cli2's `customRules` configuration:
```json
{
  "customRules": ["mkdocs-material-linter"],
  "config": {
    "material-admonition-types": true,
    "material-admonition-indentation": true,
    "material-code-annotations": true,
    "material-content-tabs": true,
    "material-navigation-structure": true
  }
}
```

## Code Style
- ESLint configuration enforces 2-space indentation
- Single quotes for strings
- Unix line endings
- Node.js >=14.0.0 compatibility