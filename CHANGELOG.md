# mkdocs-material-linter changelog

## 1.5.0 (2025-08-31)

- [Enhancement] `material-navigation-structure` rule increased character limit from 100 to 200 characters for heading titles
- [Enhancement] `material-navigation-structure` rule no longer flags vague headings like "Overview" and "Introduction"  
- [Enhancement] `material-navigation-structure` rule no longer flags ALL CAPS headings to support technical terms like "TSTP", "API", etc.

## 1.4.0 (2025-08-31)

- [Enhancement] `material-navigation-structure` rule no longer flags headings with punctuation (colons, etc.) to better support technical documentation with code snippets and error messages in headings

## 1.3.0 (2025-08-31)

- [Breaking] Removed `material-math-blocks` rule due to excessive false positives and aggressive validation
- [Fix] `material-footnotes-syntax` rule now properly ignores footnote patterns inside code blocks to prevent false positives
- [Enhancement] `material-navigation-structure` rule now allows heading level 5 (increased from max level 3)
- [Enhancement] `material-navigation-structure` rule now allows longer heading titles (up to 100 characters, increased from 50)
- [Enhancement] Reduced rule count from 14 to 13 rules for better usability

## 1.2.0 (2025-08-31)

- [Fix] `material-admonition-indentation` rule now properly handles code blocks and nested content with flexible indentation
- [Enhancement] `material-admonition-indentation` rule now allows even number spacing (4, 6, 8, etc.) instead of only multiples of 4
- [Fix] `material-admonition-indentation` rule no longer stops processing files early when encountering nested content

## 1.1.0 (2025-08-31)

- [Fix] `material-navigation-structure` rule now ignores comments inside code blocks (both fenced and indented)
- [Feature] `material-shell-language-standardization` rule enforces using "shell" instead of "bash" or "sh" for shell code blocks
- [Feature] `material-bundle-exec-shell-type` rule ensures code blocks starting with "bundle exec" use shell language type
- [Feature] `material-admonition-empty-title` rule prevents empty title quotes in admonitions
- [Enhancement] README now uses table format for rule overview with better organization

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
