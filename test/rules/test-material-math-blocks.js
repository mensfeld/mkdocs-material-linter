/**
 * Tests for material-math-blocks rule
 */
const markdownlint = require('markdownlint');
const materialMathBlocksRule = require('../../lib/rules/material-math-blocks');

function runMaterialMathBlocksTests() {
  console.log('Testing material-math-blocks rule...');

  const tests = [
    // Valid cases
    {
      name: 'Valid inline math',
      content: `# Math Examples

Simple inline math: $x = y + z$ and $a^2 + b^2 = c^2$.

More complex: $\\frac{1}{2} \\sum_{i=1}^{n} x_i$.`,
      expectedErrors: 0
    },

    {
      name: 'Valid block math single line',
      content: `# Block Math

Single line block: $$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$`,
      expectedErrors: 0
    },

    {
      name: 'Valid block math multi-line',
      content: `# Multi-line Math

$$
\\begin{align}
x &= a + b \\\\
y &= c + d
\\end{align}
$$`,
      expectedErrors: 0
    },

    {
      name: 'Valid LaTeX environments',
      content: `# LaTeX Environments

$$
\\begin{cases}
x + y = 1 \\\\
x - y = 0
\\end{cases}
$$`,
      expectedErrors: 0
    },

    // Invalid cases
    {
      name: 'Empty inline math',
      content: `# Empty Inline

This has empty inline math: $$.`,
      expectedErrors: 1
    },

    {
      name: 'Empty block math',
      content: `# Empty Block

$$
$$`,
      expectedErrors: 1
    },

    {
      name: 'Unclosed block math',
      content: `# Unclosed Block

$$
x = y + z`,
      expectedErrors: 1
    },

    {
      name: 'Unmatched braces',
      content: `# Unmatched Braces

Inline with unmatched braces: $\\frac{a}{b$.`,
      expectedErrors: 1
    },

    {
      name: 'Unmatched parentheses',
      content: `# Unmatched Parentheses

Block math with unmatched parentheses:

$$
\\left( x + y
$$`,
      expectedErrors: 1
    },

    {
      name: 'Invalid frac command',
      content: `# Invalid Frac

Math with invalid frac: $\\frac{incomplete$.`,
      expectedErrors: 1
    },

    {
      name: 'Invalid sqrt command',
      content: `# Invalid Sqrt

Math with invalid sqrt: $\\sqrt$.`,
      expectedErrors: 1
    },

    {
      name: 'Unmatched LaTeX environment',
      content: `# Unmatched Environment

$$
\\begin{align}
x = y
$$`,
      expectedErrors: 1
    },

    {
      name: 'Long inline math (should be block)',
      content: `# Long Inline Math

This inline math is too long: $x = a + b + c + d + e + f + g + h + i + j + k + l + m + n + o + p + q + r + s + t + u + v + w + x + y + z$.`,
      expectedErrors: 1
    },

    {
      name: 'Display commands in inline math',
      content: `# Display in Inline

Inline with display command: $\\displaystyle \\sum_{i=1}^{n} x_i$.`,
      expectedErrors: 1
    },

    {
      name: 'LaTeX environment without delimiters',
      content: `# Environment Without Delimiters

\\begin{align}
x = y
\\end{align}`,
      expectedErrors: 1
    },

    {
      name: 'Conflicting dollar signs',
      content: `# Dollar Conflicts

This line has conflicting $ signs that aren't math.`,
      expectedErrors: 1
    },

    {
      name: 'Uneven underscores in math',
      content: `# Underscore Conflicts

Math with uneven underscores: $x_1 + y_2 + z_$.`,
      expectedErrors: 1
    },

    {
      name: 'Multiple errors',
      content: `# Multiple Issues

Empty inline: $$ and unmatched braces: $\\frac{a$.

$$
\\begin{align}
x = y
$$`,
      expectedErrors: 3
    }
  ];

  let passed = 0;
  let total = tests.length;

  tests.forEach((test, index) => {
    const options = {
      strings: { [`test-${index}`]: test.content },
      customRules: [materialMathBlocksRule],
      config: { 
        'default': false,
        'material-math-blocks': true 
      }
    };

    markdownlint(options, (err, result) => {
      if (err) {
        console.log(`  ❌ ${test.name}: Error running test - ${err.message}`);
        return;
      }

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
    });
  });

  setTimeout(() => {
    console.log(`Material Math Blocks Tests: ${passed}/${total} passed\n`);
  }, 100);
}

module.exports = { runMaterialMathBlocksTests };

// Run if executed directly
if (require.main === module) {
  runMaterialMathBlocksTests();
}