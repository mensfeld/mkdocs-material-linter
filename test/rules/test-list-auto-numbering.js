const rule = require('../../lib/rules/list-auto-numbering.js');

module.exports = {
  name: 'list-auto-numbering',
  rule: rule,
  tests: [
    {
      name: 'Valid - all items use 1. for auto-numbering',
      markdown: `
Some text before

1. First item
1. Second item
1. Third item

Text after
`,
      errors: []
    },
    {
      name: 'Valid - list starting with 2. is ignored',
      markdown: `
Continuing from previous section:

2. Second item
3. Third item
4. Fourth item
`,
      errors: []
    },
    {
      name: 'Valid - list starting with 5. is ignored',
      markdown: `
5. Fifth item
6. Sixth item
7. Seventh item
`,
      errors: []
    },
    {
      name: 'Invalid - list starting with 1. using sequential numbers',
      markdown: `
1. First item
2. Second item
3. Third item
`,
      errors: [
        {
          lineNumber: 3,
          detail: 'Ordered list items should use "1." for auto-numbering (found "2.")'
        },
        {
          lineNumber: 4,
          detail: 'Ordered list items should use "1." for auto-numbering (found "3.")'
        }
      ]
    },
    {
      name: 'Invalid - list starting with 1. using mixed numbers',
      markdown: `
1. First item
5. Second item
10. Third item
`,
      errors: [
        {
          lineNumber: 3,
          detail: 'Ordered list items should use "1." for auto-numbering (found "5.")'
        },
        {
          lineNumber: 4,
          detail: 'Ordered list items should use "1." for auto-numbering (found "10.")'
        }
      ]
    },
    {
      name: 'Valid - nested lists with proper indentation',
      markdown: `
1. First item
1. Second item
    1. Nested item one
    1. Nested item two
1. Third item
`,
      errors: []
    },
    {
      name: 'Invalid - nested list with sequential numbers',
      markdown: `
1. First item
1. Second item
    1. Nested item one
    2. Nested item two
1. Third item
`,
      errors: [
        {
          lineNumber: 5,
          detail: 'Ordered list items should use "1." for auto-numbering (found "2.")'
        }
      ]
    },
    {
      name: 'Valid - list in code block should be ignored',
      markdown: `
Some text

\`\`\`markdown
1. First item
2. Second item
3. Third item
\`\`\`

More text
`,
      errors: []
    },
    {
      name: 'Valid - list in admonition with all 1s',
      markdown: `
!!! note "Note"
    1. First item
    1. Second item
    1. Third item
`,
      errors: []
    },
    {
      name: 'Invalid - list in admonition with sequential numbers',
      markdown: `
!!! note "Note"
    1. First item
    2. Second item
    3. Third item
`,
      errors: [
        {
          lineNumber: 4,
          detail: 'Ordered list items should use "1." for auto-numbering (found "2.")'
        },
        {
          lineNumber: 5,
          detail: 'Ordered list items should use "1." for auto-numbering (found "3.")'
        }
      ]
    },
    {
      name: 'Valid - multiple separate lists',
      markdown: `
First list:

1. Item one
1. Item two

Second list:

1. Item one
1. Item two
`,
      errors: []
    },
    {
      name: 'Invalid - first list correct, second list incorrect',
      markdown: `
First list:

1. Item one
1. Item two

Second list:

1. Item one
2. Item two
`,
      errors: [
        {
          lineNumber: 10,
          detail: 'Ordered list items should use "1." for auto-numbering (found "2.")'
        }
      ]
    },
    {
      name: 'Valid - unordered list should be ignored',
      markdown: `
- Item one
- Item two
- Item three
`,
      errors: []
    },
    {
      name: 'Valid - mixed ordered and unordered lists',
      markdown: `
1. Ordered item
1. Another ordered item

- Unordered item
- Another unordered item

1. Back to ordered
1. Still ordered
`,
      errors: []
    },
    {
      name: 'Valid - single item list starting with 1.',
      markdown: `
1. Only item
`,
      errors: []
    },
    {
      name: 'Valid - list with blank lines between items',
      markdown: `
1. First item

1. Second item

1. Third item
`,
      errors: []
    },
    {
      name: 'Invalid - list with blank lines and wrong numbers',
      markdown: `
1. First item

2. Second item

3. Third item
`,
      errors: [
        {
          lineNumber: 4,
          detail: 'Ordered list items should use "1." for auto-numbering (found "2.")'
        },
        {
          lineNumber: 6,
          detail: 'Ordered list items should use "1." for auto-numbering (found "3.")'
        }
      ]
    },
    {
      name: 'Valid - list at start of document',
      markdown: `1. First item
1. Second item
1. Third item`,
      errors: []
    },
    {
      name: 'Valid - list at end of document',
      markdown: `
Some text

1. First item
1. Second item
1. Third item`,
      errors: []
    }
  ]
};
