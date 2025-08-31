# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-08-31

### Added

- Initial release of mkdocs-material-linter
- **material-admonition-types** rule: Validates only supported admonition types are used
  - Supports all 12 official Material for MkDocs admonition types
  - Auto-fix with smart suggestions for common typos using Levenshtein distance
  - Case-sensitive validation (types must be lowercase)
- **material-admonition-indentation** rule: Ensures 4-space indentation for admonition content
  - Detects and fixes incorrect spacing
  - Converts tabs to spaces automatically
  - Validates proper indentation hierarchy
- **material-code-annotations** rule: Validates code annotation comment styles match language
  - Supports 25+ programming languages with correct comment styles
  - Detects mismatched comment styles (e.g., `//` in Python, `#` in JavaScript)
  - Handles HTML/XML style comments correctly
- **material-content-tabs** rule: Validates content tab structure and syntax
  - Enforces `===` delimiter (exactly 3 equals)
  - Requires quoted tab titles
  - Validates tab content indentation
  - Checks for reasonable title lengths
- **material-navigation-structure** rule: Validates navigation best practices
  - Prevents skipped heading levels
  - Enforces maximum navigation depth of 3 levels
  - Validates heading title length (50 character limit)
  - Detects duplicate and similar headings
  - Identifies vague or generic headings
- Helper functions for Material syntax parsing
- Comprehensive test suite with valid/invalid fixtures
- GitHub Actions CI/CD pipeline
- ESLint configuration for code quality
- Detailed documentation with examples

### Features

- Compatible with markdownlint-cli2 `customRules` system
- Auto-fix capability for formatting issues
- Configurable rule severity levels
- VS Code integration support
- Node.js 14+ compatibility
- Zero dependencies (except peer dependency on markdownlint)