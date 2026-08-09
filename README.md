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

| Rule Name | Severity | Description |
|-----------|----------|-------------|
| `material-admonition-types` | Error | Validates only supported admonition types (note, warning, tip, etc.) |
| `material-admonition-indentation` | Error | Enforces 4-space indentation for admonition content |
| `material-admonition-empty` | Error | Detects admonitions with no content (forgot to indent) |
| `material-admonition-empty-title` | Warning | Prevents empty title quotes in admonitions |
| `material-content-tabs` | Error | Validates `===` delimiter syntax and tab structure |
| `material-code-annotations` | Warning | Ensures annotation comment style matches code language |
| `material-navigation-structure` | Warning | Checks heading hierarchy and navigation best practices |
| `material-shell-language-standardization` | Warning | Enforces using "shell" instead of "bash" or "sh" for shell code blocks |
| `material-bundle-exec-shell-type` | Warning | Ensures code blocks starting with "bundle exec" use shell language type |
| `material-blank-lines-spacing` | Warning | Ensures blank lines before and after headers and after code blocks |
| `material-code-block-syntax` | Error | Code blocks must have proper syntax - no type on closing tag and all blocks must be closed |
| `material-icons-valid` | Warning | Validates icon references use valid names from supported icon sets |
| `material-meta-tags` | Warning | Encourages proper page metadata for SEO and social features |
| `material-mermaid-syntax` | Error | Validates Mermaid code blocks contain valid diagram syntax |
| `material-footnotes-syntax` | Error | Validates footnotes have matching references and definitions |

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

Add this plugin to your existing `.markdownlint-cli2.jsonc` configuration. Once registered under `customRules`, **all rules are enabled by default** — you don't need to list them individually:

```json
{
  "customRules": ["mkdocs-material-linter"]
}
```

That's all you need to get started. If you want to disable specific rules or tweak their severity, add a `config` block (see [Advanced Configuration](#advanced-configuration) below):

```json
{
  "customRules": ["mkdocs-material-linter"],
  "config": {
    "material-navigation-structure": false,
    "material-code-annotations": "warning"
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
  "markdownlint.customRules": ["mkdocs-material-linter"]
}
```

As with the CLI, all rules are enabled once registered. Add a `markdownlint.config` block only if you want to override individual rules.

## Advanced Configuration

Each rule can be individually enabled/disabled or configured:

```json
{
  "config": {
    "material-admonition-types": false,
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

## Development

### Testing

```bash
npm test        # Run all tests
npm run lint    # Run ESLint
```

### Releasing

```bash
# 1. Update version
npm version patch  # or minor/major

# 2. Publish to npm
npm publish

# 3. Create git tag
git push --tags
```