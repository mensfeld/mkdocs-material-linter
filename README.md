# mkdocs-material-linter

[![npm version](https://img.shields.io/npm/v/mkdocs-material-linter.svg)](https://www.npmjs.com/package/mkdocs-material-linter)
[![CI Status](https://github.com/mensfeld/mkdocs-material-linter/workflows/CI/badge.svg)](https://github.com/mensfeld/mkdocs-material-linter/actions)

A markdownlint-cli2 plugin that provides custom rules for validating Material for MkDocs-specific markdown syntax.

## Why This Exists

Material for MkDocs extends standard Markdown with powerful features like admonitions (`!!!`), content tabs (`===`), and collapsible blocks (`???`). However, standard markdown linters don't understand this syntax and can't validate it. This leads to:

- **Silent failures** - Invalid admonition types that don't render
- **Inconsistent formatting** - Mixed indentation breaking content blocks  
- **Broken features** - Malformed content tabs or annotations that don't work
- **Poor navigation** - Heading structures that create confusing documentation sites

This plugin ensures your Material for MkDocs documentation is valid, consistent, and follows best practices before you build your site.

## Provided Rules

- **material-admonition-types** (Error) - Validates only supported admonition types (note, warning, tip, etc.)
- **material-admonition-indentation** (Error) - Enforces 4-space indentation for admonition content
- **material-admonition-empty** (Error) - Detects admonitions with no content (forgot to indent)
- **material-content-tabs** (Error) - Validates `===` delimiter syntax and tab structure
- **material-code-annotations** (Warning) - Ensures annotation comment style matches code language
- **material-navigation-structure** (Warning) - Checks heading hierarchy and navigation best practices

## Installation & Usage

### Prerequisites

This is a plugin for markdownlint-cli2. You need to have markdownlint-cli2 installed and configured in your project first:

```bash
npm install markdownlint-cli2 --save-dev
```

### Installation

```bash
npm install mkdocs-material-linter --save-dev
# or
yarn add -D mkdocs-material-linter  
# or
pnpm add -D mkdocs-material-linter
```

### Configuration

Add this plugin to your existing `.markdownlint-cli2.jsonc` configuration:

```json
{
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

# Auto-fix issues where possible
npx markdownlint-cli2 --fix

# Add to package.json scripts
"scripts": {
  "lint:docs": "markdownlint-cli2",
  "lint:docs:fix": "markdownlint-cli2 --fix"
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

### material-admonition-types

Validates that admonitions use only supported Material for MkDocs types: `note`, `abstract`, `info`, `tip`, `success`, `question`, `warning`, `failure`, `danger`, `bug`, `example`, `quote`.

### material-admonition-indentation

Ensures admonition content uses exactly 4-space indentation, not tabs or other spacing.

### material-admonition-empty

Detects admonitions that have no content because the content is not properly indented with 4 spaces.

### material-code-annotations

Validates that code annotation comment style matches the language (e.g., `#` for Python, `//` for JavaScript).

### material-content-tabs

Validates content tab structure using `===` delimiters with quoted titles and proper indentation.

### material-navigation-structure

Validates navigation best practices: no skipped heading levels, maximum depth of 3 levels, titles under 50 characters.

## Advanced Configuration

Each rule can be individually enabled/disabled or configured:

```json
{
  "config": {
    "material-admonition-types": false,  // Disable a specific rule
    "material-admonition-indentation": true,
    "material-code-annotations": "warning",
    "material-content-tabs": true,
    "material-navigation-structure": true
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