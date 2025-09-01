/**
 * Tests for material-version-banners rule
 */
const { lint: markdownlint } = require('markdownlint/sync');
const markdownIt = require('markdown-it');
const materialVersionBannersRule = require('../../lib/rules/material-version-banners');

function runMaterialVersionBannersTests() {
  console.log('Testing material-version-banners rule...');

  const tests = [
    // Valid cases
    {
      name: 'Valid snippet include with standard banner filename',
      content: `# Banner Example

--8<-- "version-banner.md"

Some content here.`,
      expectedErrors: 0
    },

    {
      name: 'Valid snippet include with deprecation notice',
      content: `# Deprecation Example

--8<-- "deprecation-notice.md"

Content follows.`,
      expectedErrors: 0
    },

    {
      name: 'Valid version information',
      content: `# Version Info

This feature was added in version 1.2.3.
It was deprecated in v2.0.0-alpha.1.`,
      expectedErrors: 0
    },

    {
      name: 'Valid deprecation with version',
      content: `# Deprecation

!!! warning "Deprecated"
    This feature was deprecated in version 1.5.0 and will be removed in 2.0.0.`,
      expectedErrors: 0
    },

    {
      name: 'Consistent version prefixes',
      content: `# Consistent Versions

Added in v1.0.0, updated in v1.1.0, deprecated in v2.0.0.`,
      expectedErrors: 0
    },

    {
      name: 'Non-banner snippet includes should not trigger errors',
      content: `# Regular Include

--8<-- "config.yaml"

--8<-- "example.py"`,
      expectedErrors: 0
    },

    {
      name: 'Code blocks should be ignored',
      content: `# Code Block

\`\`\`markdown
--8<-- "malformed
version 999.999.999
\`\`\``,
      expectedErrors: 0
    },

    // Invalid cases - Snippet include issues
    {
      name: 'Empty filename in snippet include',
      content: `# Empty Filename

--8<-- ""

Content here.`,
      expectedErrors: 1
    },

    {
      name: 'Banner file with wrong extension',
      content: `# Wrong Extension

--8<-- "version-banner.json"

Content here.`,
      expectedErrors: 1
    },

    {
      name: 'Unquoted snippet filename',
      content: `# Unquoted

--8<-- version-banner.md

Content here.`,
      expectedErrors: 1
    },

    {
      name: 'Single quotes in snippet include',
      content: `# Single Quotes

--8<-- 'version-banner.md'

Content here.`,
      expectedErrors: 1
    },

    {
      name: 'Incomplete snippet include',
      content: `# Incomplete

--8<--

Content here.`,
      expectedErrors: 1
    },

    {
      name: 'Malformed snippet syntax',
      content: `# Malformed

--8< "version-banner.md"

Content here.`,
      expectedErrors: 1
    },

    {
      name: 'Incomplete dash sequence',
      content: `# Incomplete

-8<-- "version-banner.md"

Content here.`,
      expectedErrors: 1
    },

    // Invalid cases - Version issues
    {
      name: 'Inconsistent version prefixes',
      content: `# Inconsistent

Added in v1.0.0 and updated in 1.1.0.`,
      expectedErrors: 1
    },

    {
      name: 'Deprecation notice without version info',
      content: `# Missing Version

!!! warning "Deprecated"
    This feature is deprecated.`,
      expectedErrors: 1
    },

    {
      name: 'Wrong admonition type for deprecation',
      content: `# Wrong Type

!!! info "Deprecated"
    This should use warning or danger.`,
      expectedErrors: 1
    },

    {
      name: 'Non-standard banner filename suggestion',
      content: `# Non-standard Name

--8<-- "my-custom-banner-file.md"

Content here.`,
      expectedErrors: 1
    },

    // Multiple errors
    {
      name: 'Multiple issues',
      content: `# Multiple

--8<-- 'wrong-quotes.txt'

!!! info "Deprecated"
    No version info and wrong admonition type.

Version v1.0 and 2.0 are inconsistent.`,
      expectedErrors: 3
    },

    {
      name: 'Mixed valid and invalid',
      content: `# Mixed

--8<-- "version-banner.md"

--8<-- malformed-include

!!! warning "Deprecated"
    Properly deprecated in version 1.5.0.`,
      expectedErrors: 1
    }
  ];

  let passed = 0;
  let total = tests.length;

  tests.forEach((test, index) => {
    const options = {
      strings: { [`test-${index}`]: test.content },
      customRules: [materialVersionBannersRule],
      config: { 
        'default': false,
        'material-version-banners': true 
      },
      markdownItFactory: () => markdownIt()
    };

    try {
      const result = markdownlint(options);
      const errors = result[`test-${index}`] || [];
      const errorCount = errors.length;

      if (errorCount === test.expectedErrors) {
        console.log(`  ✅ ${test.name}`);
        passed++;
      } else {
        console.log(`  ❌ ${test.name}: Expected ${test.expectedErrors} errors, got ${errorCount}`);
        if (errorCount > 0) {
          errors.forEach(error => {
            console.log(`     Line ${error.lineNumber}: ${error.ruleDescription}`);
          });
        }
      }
    } catch (err) {
      console.log(`  ❌ ${test.name}: Error running test - ${err.message}`);
    }
  });

  setTimeout(() => {
    console.log(`Material Version Banners Tests: ${passed}/${total} passed\n`);
  }, 100);
}

module.exports = { runMaterialVersionBannersTests };

// Run if executed directly
if (require.main === module) {
  runMaterialVersionBannersTests();
}