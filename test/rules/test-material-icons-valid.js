/**
 * Tests for material-icons-valid rule
 */
const markdownlint = require('markdownlint');
const materialIconsValidRule = require('../../lib/rules/material-icons-valid');

function runMaterialIconsValidTests() {
  console.log('Testing material-icons-valid rule...');

  const tests = [
    // Valid cases
    {
      name: 'Valid material icons',
      content: `# Material Icons
Here are some valid icons: :material-home:, :material-search:, :material-settings:.

Additional valid ones: :material-account: and :material-favorite:.`,
      expectedErrors: 0
    },

    {
      name: 'Valid FontAwesome icons',
      content: `# FontAwesome Icons
Valid FontAwesome: :fontawesome-solid-home:, :fontawesome-regular-heart:, :fontawesome-brands-github:.`,
      expectedErrors: 0
    },

    {
      name: 'Valid Octicons',
      content: `# Octicons
Valid octicons: :octicons-alert:, :octicons-book:, :octicons-star:.`,
      expectedErrors: 0
    },

    // Invalid cases
    {
      name: 'Invalid material icon',
      content: `# Invalid Material Icons
This icon doesn't exist: :material-nonexistent:.`,
      expectedErrors: 1
    },

    {
      name: 'Invalid FontAwesome icon',
      content: `# Invalid FontAwesome
This FontAwesome icon doesn't exist: :fontawesome-solid-nonexistent:.`,
      expectedErrors: 1
    },

    {
      name: 'Invalid Octicon',
      content: `# Invalid Octicon
This octicon doesn't exist: :octicons-nonexistent:.`,
      expectedErrors: 1
    },

    {
      name: 'Mixed valid and invalid icons',
      content: `# Mixed Icons
Valid: :material-home: and :material-search:.
Invalid: :material-nonexistent: and :material-anotherfake:.
Also valid: :octicons-star:.`,
      expectedErrors: 2
    },

    {
      name: 'Simple icons (should not validate)',
      content: `# Simple Icons
Simple icons are not validated: :simple-python: :simple-javascript: :simple-nonexistent:.`,
      expectedErrors: 0
    }
  ];

  let passed = 0;
  let total = tests.length;

  tests.forEach((test, index) => {
    const options = {
      strings: { [`test-${index}`]: test.content },
      customRules: [materialIconsValidRule],
      config: { 
        'default': false,
        'material-icons-valid': true 
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
    console.log(`Material Icons Valid Tests: ${passed}/${total} passed\n`);
  }, 100);
}

module.exports = { runMaterialIconsValidTests };

// Run if executed directly
if (require.main === module) {
  runMaterialIconsValidTests();
}