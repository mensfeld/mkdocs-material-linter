/**
 * Tests for material-meta-tags rule
 */
const { lint: markdownlint } = require('markdownlint/sync');
const markdownIt = require('markdown-it');
const materialMetaTagsRule = require('../../lib/rules/material-meta-tags');

function runMaterialMetaTagsTests() {
  console.log('Testing material-meta-tags rule...');

  const tests = [
    // Valid cases
    {
      name: 'Complete metadata',
      content: `---
title: Page Title
description: A good page description under 160 characters.
tags: [seo, metadata]
template: main.html
---

# Content
This page has good metadata.`,
      expectedErrors: 0
    },

    {
      name: 'Minimal valid metadata',
      content: `---
title: Simple Page
description: Basic description.
---

# Content
Minimal but valid.`,
      expectedErrors: 0
    },

    // Cases with warnings/errors
    {
      name: 'Missing front matter',
      content: `# No Front Matter
This page has no metadata.`,
      expectedErrors: 1
    },

    {
      name: 'Unclosed front matter',
      content: `---
title: Test
description: Missing closing delimiter`,
      expectedErrors: 1
    },

    {
      name: 'Missing description',
      content: `---
title: Page Title
tags: [example]
---

# Content
No description provided.`,
      expectedErrors: 1
    },

    {
      name: 'Long description',
      content: `---
title: Page Title
description: This is a very long description that exceeds the recommended 160 character limit for SEO purposes and should trigger a warning about the length.
---

# Content
Description too long.`,
      expectedErrors: 1
    },

    {
      name: 'Invalid template',
      content: `---
title: Page Title
description: Valid description.
template: invalid-template
---

# Content
Invalid template specified.`,
      expectedErrors: 1
    },

    {
      name: 'Invalid tags format',
      content: `---
title: Page Title
description: Valid description.
tags: tag1, tag2, tag3
---

# Content
Tags not in proper YAML format.`,
      expectedErrors: 1
    },

    {
      name: 'Invalid hide options',
      content: `---
title: Page Title
description: Valid description.
hide: invalid, navigation
---

# Content
Invalid hide option.`,
      expectedErrors: 1
    },

    {
      name: 'Valid hide options',
      content: `---
title: Page Title
description: Valid description.
hide: navigation, toc
---

# Content
Valid hide options.`,
      expectedErrors: 0
    }
  ];

  let passed = 0;
  let total = tests.length;

  tests.forEach((test, index) => {
    const options = {
      strings: { [`test-${index}`]: test.content },
      customRules: [materialMetaTagsRule],
      config: { 
        markdownItFactory: () => markdownIt(),
        'default': false,
        'material-meta-tags': true 
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
    console.log(`Material Meta Tags Tests: ${passed}/${total} passed\n`);
  }, 100);
}

module.exports = { runMaterialMetaTagsTests };

// Run if executed directly
if (require.main === module) {
  runMaterialMetaTagsTests();
}