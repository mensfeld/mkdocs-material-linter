/**
 * Tests for material-tooltip-syntax rule
 */
const { lint: markdownlint } = require('markdownlint/sync');
const markdownIt = require('markdown-it');
const materialTooltipSyntaxRule = require('../../lib/rules/material-tooltip-syntax');

function runMaterialTooltipSyntaxTests() {
  console.log('Testing material-tooltip-syntax rule...');

  const tests = [
    // Valid cases
    {
      name: 'Valid link with tooltip',
      content: `# Tooltip Example

This is a [link with tooltip](https://example.com "This is a helpful tooltip").`,
      expectedErrors: 0
    },

    {
      name: 'Valid annotations',
      content: `# Annotations Example

This code has annotations (1) and more annotations (2)!

Some text with question annotation (3)?`,
      expectedErrors: 0
    },

    {
      name: 'Valid mixed tooltips and annotations',
      content: `# Mixed Example

Check this [documentation](https://docs.example.com "Comprehensive guide") for details (1).

The configuration (2)! is important.`,
      expectedErrors: 0
    },

    {
      name: 'Tooltips in code blocks should be ignored',
      content: `# Code Block Example

\`\`\`markdown
This [link](url "tooltip") should be ignored in code blocks.
Also annotations (1) should be ignored.
\`\`\``,
      expectedErrors: 0
    },

    {
      name: 'Inline code with annotations should be ignored',
      content: `# Inline Code

Use \`function(1)\` to call the function.`,
      expectedErrors: 0
    },

    // Invalid cases - Tooltip issues
    {
      name: 'Empty tooltip text',
      content: `# Empty Tooltip

This [link](https://example.com "") has empty tooltip.`,
      expectedErrors: 1
    },

    {
      name: 'Short tooltip text',
      content: `# Short Tooltip

This [link](https://example.com "No") has very short tooltip.`,
      expectedErrors: 1
    },

    {
      name: 'Redundant tooltip text',
      content: `# Redundant Tooltip

This [documentation](https://example.com "documentation") is redundant.`,
      expectedErrors: 1
    },

    {
      name: 'Missing space before tooltip',
      content: `# No Space

This [link](https://example.com"tooltip") is malformed.`,
      expectedErrors: 1
    },

    {
      name: 'Single quotes instead of double',
      content: `# Single Quotes

This [link](https://example.com 'tooltip') uses wrong quotes.`,
      expectedErrors: 1
    },

    {
      name: 'Unquoted tooltip',
      content: `# Unquoted

This [link](https://example.com tooltip) has unquoted tooltip.`,
      expectedErrors: 1
    },

    {
      name: 'Unclosed tooltip quote',
      content: `# Unclosed Quote

This [link](https://example.com "unclosed tooltip`,
      expectedErrors: 1
    },

    // Invalid cases - Annotation issues
    {
      name: 'Zero annotation number',
      content: `# Zero Annotation

This text has annotation (0) which is invalid.`,
      expectedErrors: 1
    },

    {
      name: 'Very high annotation number',
      content: `# High Number

This annotation (999) is unusually high.`,
      expectedErrors: 1
    },

    {
      name: 'Missing space before annotation',
      content: `# No Space

This text(1) needs space before annotation.`,
      expectedErrors: 1
    },

    {
      name: 'Letter annotations',
      content: `# Letter Annotation

This annotation (a) should use numbers.`,
      expectedErrors: 1
    },

    {
      name: 'Empty annotation',
      content: `# Empty

This annotation () is empty.`,
      expectedErrors: 1
    },

    {
      name: 'Malformed annotation with text',
      content: `# Malformed

This annotation (1abc) contains invalid characters.`,
      expectedErrors: 1
    },

    // Multiple errors
    {
      name: 'Multiple tooltip and annotation errors',
      content: `# Multiple Errors

Bad [link](url 'wrong quotes') and annotation(0) without space.
Also [empty](url "") tooltip and letter annotation (x).`,
      expectedErrors: 4
    },

    {
      name: 'Mixed valid and invalid',
      content: `# Mixed

Good [link](https://example.com "Good tooltip") and annotation (1).
Bad [link](url) missing tooltip and annotation (a) with letter.`,
      expectedErrors: 1
    }
  ];

  let passed = 0;
  let total = tests.length;

  tests.forEach((test, index) => {
    const options = {
      strings: { [`test-${index}`]: test.content },
      customRules: [materialTooltipSyntaxRule],
      config: { 
        'default': false,
        'material-tooltip-syntax': true 
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
    console.log(`Material Tooltip Syntax Tests: ${passed}/${total} passed\n`);
  }, 100);
}

module.exports = { runMaterialTooltipSyntaxTests };

// Run if executed directly
if (require.main === module) {
  runMaterialTooltipSyntaxTests();
}