/**
 * Tests for material-footnotes-syntax rule
 */
const markdownlint = require('markdownlint');
const materialFootnotesSyntaxRule = require('../../lib/rules/material-footnotes-syntax');

function runMaterialFootnotesSyntaxTests() {
  console.log('Testing material-footnotes-syntax rule...');

  const tests = [
    // Valid cases
    {
      name: 'Valid footnotes',
      content: `# Footnotes Example

This text has footnotes[^1] and more footnotes[^note].

[^1]: This is the first footnote.
[^note]: This is a named footnote.`,
      expectedErrors: 0
    },

    {
      name: 'Sequential numeric footnotes',
      content: `# Sequential Footnotes

First[^1], second[^2], and third[^3] footnotes.

[^1]: First footnote.
[^2]: Second footnote.
[^3]: Third footnote.`,
      expectedErrors: 0
    },

    {
      name: 'Mixed numeric and named footnotes',
      content: `# Mixed Footnotes

Numeric[^1] and named[^example] footnotes together.

[^1]: Numeric footnote.
[^example]: Named footnote.`,
      expectedErrors: 0
    },

    // Invalid cases
    {
      name: 'Reference without definition',
      content: `# Missing Definition

This has a footnote reference[^missing] but no definition.`,
      expectedErrors: 1
    },

    {
      name: 'Definition without reference',
      content: `# Missing Reference

No reference to this footnote.

[^orphan]: This footnote is never referenced.`,
      expectedErrors: 1
    },

    {
      name: 'Duplicate definitions',
      content: `# Duplicate Definition

Reference to footnote[^dup].

[^dup]: First definition.
[^dup]: Second definition (duplicate).`,
      expectedErrors: 1
    },

    {
      name: 'Empty definition',
      content: `# Empty Definition

Reference to footnote[^empty].

[^empty]:`,
      expectedErrors: 1
    },

    {
      name: 'Missing colon in definition',
      content: `# Missing Colon

Reference to footnote[^nocolon].

[^nocolon] This should have a colon.`,
      expectedErrors: 1
    },

    {
      name: 'No space after colon',
      content: `# No Space After Colon

Reference to footnote[^nospace].

[^nospace]:Content without space after colon.`,
      expectedErrors: 1
    },

    {
      name: 'Invalid ID with spaces',
      content: `# Invalid ID

Reference to footnote[^invalid id].

[^invalid id]: Footnote IDs cannot contain spaces.`,
      expectedErrors: 2
    },

    {
      name: 'Empty footnote reference',
      content: `# Empty Reference

Reference to empty footnote[^].`,
      expectedErrors: 1
    },

    {
      name: 'Non-sequential numeric footnotes',
      content: `# Non-Sequential

First[^1] and third[^3] footnotes, skipping second.

[^1]: First footnote.
[^3]: Third footnote (should be [^2]).`,
      expectedErrors: 1
    },

    {
      name: 'Multiple errors',
      content: `# Multiple Issues

Reference[^1] and missing[^missing] and duplicate[^dup].

[^1]: Valid footnote.
[^dup]: First definition.
[^dup]: Duplicate definition.
[^orphan]: Orphaned footnote.`,
      expectedErrors: 3
    }
  ];

  let passed = 0;
  let total = tests.length;

  tests.forEach((test, index) => {
    const options = {
      strings: { [`test-${index}`]: test.content },
      customRules: [materialFootnotesSyntaxRule],
      config: { 
        'default': false,
        'material-footnotes-syntax': true 
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
    console.log(`Material Footnotes Syntax Tests: ${passed}/${total} passed\n`);
  }, 100);
}

module.exports = { runMaterialFootnotesSyntaxTests };

// Run if executed directly
if (require.main === module) {
  runMaterialFootnotesSyntaxTests();
}