# Example Usage

This document demonstrates how to use mkdocs-material-linter with your Material for MkDocs projects.

## Installation

```shell
npm install mkdocs-material-linter --save-dev
```

## Configuration

### With markdownlint-cli2

Create or update your `.markdownlint-cli2.jsonc`:

```json
{
  "globs": ["**/*.md"],
  "customRules": [
    "mkdocs-material-linter"
  ],
  "config": {
    "material-admonition-types": true,
    "material-admonition-indentation": true,
    "material-code-annotations": "warning",
    "material-content-tabs": true,
    "material-navigation-structure": "warning"
  }
}
```

### Running the Linter

```shell
# Lint all markdown files
npx markdownlint-cli2

# Lint specific files
npx markdownlint-cli2 "docs/**/*.md"

# Auto-fix issues where possible
npx markdownlint-cli2 --fix
```

## Examples

### Valid Material for MkDocs Syntax

This content will pass all rules:

````markdown
# Project Documentation

## Getting Started

This section covers the basics.

### Installation

!!! note "Requirements"
    Make sure you have Python 3.8+ installed.

Follow these steps:

=== "pip"
    ```shell
    pip install mkdocs-material
    ```

=== "conda"
    ```shell
    conda install -c conda-forge mkdocs-material
    ```

### Configuration

!!! tip
    Use the configuration wizard for quick setup.
    
    You can run it with:
    
    ```shell
    mkdocs new my-project  # (1)!
    ```
    
    1. This creates a new MkDocs project

!!! warning "Important"
    Always backup your configuration before making changes.
````

### Common Issues and Fixes

The linter will catch these common mistakes:

#### Invalid Admonition Types

❌ **Wrong:**
```markdown
!!! caution
    This type doesn't exist
```

✅ **Correct:**
```markdown
!!! warning
    Use 'warning' instead of 'caution'
```

#### Incorrect Indentation

❌ **Wrong:**
```markdown
!!! note
  Only 2 spaces
```

✅ **Correct:**
```markdown
!!! note
    Use 4 spaces for indentation
```

#### Bad Content Tabs

❌ **Wrong:**
```markdown
== "Missing Equal"
    Not enough equals signs

=== Unquoted Title
    Titles must be quoted
```

✅ **Correct:**
```markdown
=== "Proper Tab"
    Content with proper indentation
```

#### Wrong Code Annotation Style

❌ **Wrong:**
```python
print("Hello")  // (1)!  # Should use # for Python
```

✅ **Correct:**
```python
print("Hello")  # (1)!
```

## Rule Configuration

You can customize each rule's behavior:

```json
{
  "config": {
    "material-admonition-types": {
      "enabled": true,
      "autofix": true
    },
    "material-admonition-indentation": true,
    "material-code-annotations": false,
    "material-content-tabs": "warning",
    "material-navigation-structure": {
      "enabled": true,
      "maxDepth": 3,
      "maxTitleLength": 50
    }
  }
}
```

## VS Code Integration

Add to your `.vscode/settings.json`:

```json
{
  "markdownlint.customRules": [
    "mkdocs-material-linter"
  ],
  "markdownlint.config": {
    "material-admonition-types": true,
    "material-admonition-indentation": true,
    "material-code-annotations": true,
    "material-content-tabs": true,
    "material-navigation-structure": true
  }
}
```

## CI/CD Integration

### GitHub Actions

```yaml
name: Lint Documentation

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install mkdocs-material-linter
      - run: npx markdownlint-cli2
```

### Pre-commit Hook

Add to your `package.json`:

```json
{
  "scripts": {
    "lint:docs": "markdownlint-cli2",
    "lint:docs:fix": "markdownlint-cli2 --fix"
  },
  "husky": {
    "hooks": {
      "pre-commit": "npm run lint:docs"
    }
  }
}
```