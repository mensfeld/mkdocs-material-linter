# mkdocs-material-linter

[![npm version](https://img.shields.io/npm/v/mkdocs-material-linter.svg)](https://www.npmjs.com/package/mkdocs-material-linter)
[![CI Status](https://github.com/mensfeld/mkdocs-material-linter/workflows/CI/badge.svg)](https://github.com/mensfeld/mkdocs-material-linter/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/mensfeld/mkdocs-material-linter.svg)](https://github.com/mensfeld/mkdocs-material-linter)

A comprehensive markdownlint-cli2 plugin that validates Material for MkDocs-specific markdown syntax including admonitions, content tabs, code annotations, and navigation structure.

## Why This Exists

Material for MkDocs extends standard Markdown with powerful features like admonitions (`!!!`), content tabs (`===`), and collapsible blocks (`???`). However, standard markdown linters don't understand this syntax and can't validate it. This leads to:

- **Silent failures** - Invalid admonition types that don't render
- **Inconsistent formatting** - Mixed indentation breaking content blocks  
- **Broken features** - Malformed content tabs or annotations that don't work
- **Poor navigation** - Heading structures that create confusing documentation sites

This plugin ensures your Material for MkDocs documentation is valid, consistent, and follows best practices before you build your site.

## Quick Start

```bash
# Install
npm install mkdocs-material-linter --save-dev

# Create config file
echo '{
  "globs": ["**/*.md"],
  "ignores": ["node_modules/**"],
  "customRules": ["mkdocs-material-linter"],
  "config": {
    "material-admonition-types": true,
    "material-admonition-indentation": true,
    "material-admonition-empty": true,
    "material-code-annotations": true,
    "material-content-tabs": true,
    "material-navigation-structure": true
  }
}' > .markdownlint-cli2.jsonc

# Run linter
npx markdownlint-cli2
```

### Try It Now

```bash
# Test with a sample
echo '!!! invalid "test"\n    Content here' | npx markdownlint-cli2 --stdin --customRules mkdocs-material-linter
```

## What It Validates

| Rule | Purpose | Severity |
|------|---------|----------|
| `material-admonition-types` | Validates only supported admonition types (note, warning, tip, etc.) | Error |
| `material-admonition-indentation` | Enforces 4-space indentation for admonition content | Error |
| `material-admonition-empty` | Detects admonitions with no content (forgot to indent) | Error |
| `material-content-tabs` | Validates `===` delimiter syntax and tab structure | Error |
| `material-code-annotations` | Ensures annotation comment style matches code language | Warning |
| `material-navigation-structure` | Checks heading hierarchy and navigation best practices | Warning |

## Supported Material Syntax

### Admonitions (Both `!!!` and `???`)
```markdown
!!! note "Regular admonition"
    Content with 4-space indentation

??? tip "Collapsible admonition"
    Hidden content

???+ warning "Expanded collapsible"
    Initially visible content
```

### Content Tabs
```markdown
=== "Tab 1"
    Content for first tab

=== "Tab 2"
    Content for second tab
```

### Code Annotations
```python
print("Hello")  # (1)!
```
```javascript
console.log("Hello");  // (1)!
```

## Installation & Usage

### Installation

```bash
npm install mkdocs-material-linter --save-dev
# or
yarn add -D mkdocs-material-linter  
# or
pnpm add -D mkdocs-material-linter
```

### Configuration

Create `.markdownlint-cli2.jsonc` in your project root:

```json
{
  "globs": ["docs/**/*.md", "*.md"],
  "ignores": ["node_modules/**", "dist/**", ".git/**"],
  "customRules": ["mkdocs-material-linter"],
  "config": {
    "material-admonition-types": true,
    "material-admonition-indentation": true,
    "material-admonition-empty": true,
    "material-code-annotations": true,
    "material-content-tabs": true,
    "material-navigation-structure": true
  }
}
```

### Running the Linter

```bash
# Lint all markdown files
npx markdownlint-cli2

# Lint specific files
npx markdownlint-cli2 "docs/**/*.md"

# Lint with custom rules only
npx markdownlint-cli2

# Add to package.json scripts
"scripts": {
  "lint:docs": "markdownlint-cli2",
  "lint:docs": "markdownlint-cli2"
}
```

### VS Code Integration

Install the [markdownlint extension](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint), then add to `.vscode/settings.json`:

```json
{
  "markdownlint.customRules": ["mkdocs-material-linter"],
  "markdownlint.config": {
    "material-admonition-types": true,
    "material-admonition-indentation": true,
    "material-code-annotations": true,
    "material-content-tabs": true,
    "material-navigation-structure": true
  }
}
```

## Rule Details

### material-admonition-types (Error)

Validates that admonitions use only supported Material for MkDocs types.

**Supported types:**
- `note`, `abstract`, `info`, `tip`, `success`, `question`
- `warning`, `failure`, `danger`, `bug`, `example`, `quote`

**Examples:**

✅ Valid:
```markdown
!!! note "Optional title"
    Content with 4 spaces

??? tip
    Collapsible content
```

❌ Invalid:
```markdown
!!! invalid
    This type doesn't exist

!!! Note
    Type should be lowercase
```

### material-admonition-indentation (Error)

Ensures admonition content uses exactly 4-space indentation.

**Examples:**

✅ Valid:
```markdown
!!! note
    Content indented with 4 spaces
    
    More content with 4 spaces
```

❌ Invalid:
```markdown
!!! note
  Content with only 2 spaces

!!! warning
		Content with tabs
```

### material-admonition-empty (Error)

Detects admonitions that have no content because the content is not properly indented. This is a common mistake where writers forget to indent the content with 4 spaces.

**Examples:**

✅ Valid:
```markdown
!!! warning "Title"
    This content is properly indented.
```

❌ Invalid:
```markdown
!!! warning "Title"
This content is not indented - won't be part of the admonition!

!!! danger

??? tip
  Only 2 spaces - needs 4!
```

### material-code-annotations (Warning)

Validates that code annotation syntax matches the language comment style.

**Examples:**

✅ Valid:
```python
print("Hello")  # (1)!
```

```javascript
console.log("Hello");  // (1)!
```

❌ Invalid:
```python
print("Hello")  // (1)!  # Wrong comment style
```

### material-content-tabs (Error)

Validates content tab structure and syntax.

**Examples:**

✅ Valid:
```markdown
=== "Tab 1"
    Content for tab 1

=== "Tab 2"
    Content for tab 2
```

❌ Invalid:
```markdown
== "Tab 1"  # Wrong delimiter
    Content

=== Tab 1  # Missing quotes
    Content
```

### material-navigation-structure (Warning)

Validates navigation best practices:
- No skipped heading levels
- Maximum navigation depth of 3 levels
- Navigation titles under 50 characters

**Examples:**

✅ Valid:
```markdown
# Main Title
## Section
### Subsection
```

❌ Invalid:
```markdown
# Main Title
### Skipped Level

# This Is A Very Long Navigation Title That Exceeds The Recommended Character Limit
```

## Advanced Configuration

Each rule can be individually enabled/disabled or configured:

```json
{
  "config": {
    "material-admonition-types": true,
    "material-admonition-indentation": true,
    "material-code-annotations": false,
    "material-content-tabs": true,
    "material-navigation-structure": "warning"
  }
}
```

## CI/CD Integration

### GitHub Actions

```yaml
name: CI
on: [push, pull_request]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint        # Lint JavaScript code
      - run: npm test            # Run tests
      - run: npx markdownlint-cli2  # Lint documentation
```

### Pre-commit Hook

Add to your `package.json`:
```json
{
  "scripts": {
    "lint:docs": "markdownlint-cli2"
  },
  "husky": {
    "hooks": {
      "pre-commit": "npm run lint:docs"
    }
  }
}
```

## FAQ

**Q: Why do I get errors about missing dependencies?**  
A: Make sure you have `markdownlint` >= 0.30.0 installed as a peer dependency.

**Q: Can I disable specific rules?**  
A: Yes! Set any rule to `false` in your config or use `"off"`.

**Q: Does this work with regular markdownlint (not CLI2)?**  
A: Yes, but markdownlint-cli2 is recommended for better performance and features.

**Q: Can I use this with other Material themes?**  
A: This is specifically designed for Material for MkDocs. Other themes may have different syntax.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Related Projects

- [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/) - The theme this linter supports
- [markdownlint-cli2](https://github.com/DavidAnson/markdownlint-cli2) - The CLI tool this plugin works with
- [markdownlint](https://github.com/DavidAnson/markdownlint) - The core markdown linting library