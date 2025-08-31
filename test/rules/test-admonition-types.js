/**
 * Tests for material-admonition-types rule
 */
const markdownlint = require('markdownlint');
const admonitionTypesRule = require('../../lib/rules/admonition-types');

function runAdmonitionTypesTests() {
  console.log('Testing material-admonition-types rule...');

  const tests = [
    // Valid cases
    {
      name: 'Valid admonition types',
      content: `!!! note
    Valid note type.

!!! warning
    Valid warning type.

!!! success "Title"
    Valid success type with title.`,
      expectedErrors: 0
    },

    // Invalid cases
    {
      name: 'Invalid admonition type',
      content: `!!! invalid
    This should trigger an error.`,
      expectedErrors: 1
    },

    {
      name: 'Case sensitive validation',
      content: `!!! NOTE
    Should be lowercase.

!!! Warning
    Should be lowercase.`,
      expectedErrors: 2
    },

    {
      name: 'Common typos',
      content: `!!! warnng
    Typo in warning.

!!! infom
    Typo in info.`,
      expectedErrors: 2
    },

    {
      name: 'Mixed valid and invalid',
      content: `!!! note
    This is valid.

!!! invalid
    This is not valid.

!!! tip
    This is valid again.`,
      expectedErrors: 1
    }
  ];

  let passed = 0;
  let total = tests.length;

  tests.forEach((test, index) => {
    const options = {
      strings: { [`test-${index}`]: test.content },
      customRules: [admonitionTypesRule],
      config: { 'material-admonition-types': true }
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
    console.log(`Admonition Types Tests: ${passed}/${total} passed\n`);
  }, 100);
}

module.exports = { runAdmonitionTypesTests };

// Run if executed directly
if (require.main === module) {
  runAdmonitionTypesTests();
}
