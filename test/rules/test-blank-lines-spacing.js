const rule = require('../../lib/rules/blank-lines-spacing.js');

module.exports = {
  name: 'blank-lines-spacing',
  rule: rule,
  tests: [
    {
      name: 'Valid - headers with blank lines',
      markdown: `
Some text

# Header 1

Content here

## Header 2

More content
`,
      errors: []
    },
    {
      name: 'Valid - code block with blank line after',
      markdown: `
Text before

\`\`\`python
code here
\`\`\`

Text after
`,
      errors: []
    },
    {
      name: 'Invalid - header without blank line before',
      markdown: `
Some text
# Header 1

Content
`,
      errors: [
        {
          lineNumber: 3,
          detail: 'Headers should be preceded by a blank line'
        }
      ]
    },
    {
      name: 'Invalid - header without blank line after',
      markdown: `
Some text

# Header 1
Content
`,
      errors: [
        {
          lineNumber: 5,
          detail: 'Headers should be followed by a blank line'
        }
      ]
    },
    {
      name: 'Invalid - code block without blank line after',
      markdown: `
Text before

\`\`\`python
code here
\`\`\`
Text after
`,
      errors: [
        {
          lineNumber: 7,
          detail: 'Code blocks should be followed by a blank line'
        }
      ]
    },
    {
      name: 'Valid - consecutive headers (no blank line required between them)',
      markdown: `
Text

# Header 1
## Header 2

Content
`,
      errors: []
    },
    {
      name: 'Valid - headers and code in admonition (no spacing rules apply)',
      markdown: `
!!! note "Title"
    # Header in admonition
    Content

    \`\`\`python
    code
    \`\`\`
    More content
`,
      errors: []
    },
    {
      name: 'Invalid - multiple issues',
      markdown: `
Text
## Header without space before
Content without space after header

\`\`\`bash
echo "test"
\`\`\`
No space after code block
### Another header
Without proper spacing
`,
      errors: [
        {
          lineNumber: 3,
          detail: 'Headers should be preceded by a blank line'
        },
        {
          lineNumber: 4,
          detail: 'Headers should be followed by a blank line'
        },
        {
          lineNumber: 9,
          detail: 'Code blocks should be followed by a blank line'
        },
        {
          lineNumber: 10,
          detail: 'Headers should be preceded by a blank line'
        },
        {
          lineNumber: 11,
          detail: 'Headers should be followed by a blank line'
        }
      ]
    },
    {
      name: 'Valid - code block at end of file',
      markdown: `
Text

\`\`\`python
code
\`\`\``,
      errors: []
    },
    {
      name: 'Valid - header at start of file',
      markdown: `# Header

Content`,
      errors: []
    },
    {
      name: 'Valid - header at end of file',
      markdown: `
Content

## Header`,
      errors: []
    },
    {
      name: 'Valid - code block followed by header (header rules apply)',
      markdown: `
\`\`\`python
code
\`\`\`

# Header

Content
`,
      errors: []
    },
    {
      name: 'Invalid - code block followed directly by header',
      markdown: `
\`\`\`python
code
\`\`\`
# Header

Content
`,
      errors: [
        {
          lineNumber: 5,
          detail: 'Headers should be preceded by a blank line'
        }
      ]
    }
  ]
};