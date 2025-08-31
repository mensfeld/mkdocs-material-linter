# mkdocs-material-linter changelog

## 1.0.0 (2024-08-31)

- [Feature] Initial release of mkdocs-material-linter
- [Feature] `material-admonition-types` rule for validating supported admonition types
- [Feature] `material-admonition-indentation` rule for enforcing 4-space indentation
- [Feature] `material-admonition-empty` rule for detecting admonitions with no content
- [Feature] `material-code-annotations` rule for validating comment style matches language
- [Feature] `material-content-tabs` rule for validating tab structure and syntax
- [Feature] `material-navigation-structure` rule for navigation best practices
- [Feature] Support for both regular (`!!!`) and collapsible (`???`, `???+`) admonitions
- [Feature] Compatible with markdownlint-cli2 `customRules` system
- [Feature] Comprehensive test suite with valid/invalid fixtures
- [Feature] GitHub Actions CI/CD pipeline with multi-Node version testing
- [Feature] VS Code integration support through markdownlint extension
- [Enhancement] Smart suggestions for common admonition type typos
- [Enhancement] Detailed error messages with context and suggestions
- [Enhancement] ESLint configuration for code quality
- [Maintenance] Node.js 16+ compatibility
- [Maintenance] Zero runtime dependencies except markdownlint peer dependency
