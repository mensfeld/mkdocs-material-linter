const rule = require('../../lib/rules/code-block-syntax.js');

module.exports = {
  name: 'code-block-syntax',
  rule: rule,
  tests: [
    {
      name: 'Valid - properly closed code block',
      markdown: `
Text before

\`\`\`python
def hello():
    print("world")
\`\`\`

Text after
`,
      errors: []
    },
    {
      name: 'Valid - multiple properly closed blocks',
      markdown: `
\`\`\`javascript
console.log("test");
\`\`\`

Some text

\`\`\`python
print("hello")
\`\`\`
`,
      errors: []
    },
    {
      name: 'Invalid - closing tag with language type',
      markdown: `
\`\`\`text
This is some text
\`\`\`text

More content
`,
      errors: [
        {
          lineNumber: 4,
          detail: 'Code block closing tags must not have a language type (use \`\`\` only)'
        }
      ]
    },
    {
      name: 'Invalid - unclosed code block',
      markdown: `
Text before

\`\`\`python
def hello():
    print("world")

End of file without closing
`,
      errors: [
        {
          lineNumber: 4,
          detail: 'Code block is not closed (missing closing \`\`\`)'
        }
      ]
    },
    {
      name: 'Invalid - multiple issues',
      markdown: `
\`\`\`bash
echo "test"
\`\`\`bash

\`\`\`python
print("hello")

No closing for python block
`,
      errors: [
        {
          lineNumber: 4,
          detail: 'Code block closing tags must not have a language type (use \`\`\` only)'
        },
        {
          lineNumber: 6,
          detail: 'Code block is not closed (missing closing \`\`\`)'
        }
      ]
    },
    {
      name: 'Valid - nested code blocks in admonition',
      markdown: `
!!! note "Example"
    Some text

    \`\`\`python
    def test():
        pass
    \`\`\`

    More text
`,
      errors: []
    },
    {
      name: 'Invalid - unclosed code block in admonition',
      markdown: `
!!! warning
    Text

    \`\`\`javascript
    console.log("test");

    Missing closing tag
`,
      errors: [
        {
          lineNumber: 5,
          detail: 'Code block is not closed (missing closing \`\`\`)'
        }
      ]
    },
    {
      name: 'Invalid - closing tag with type in admonition',
      markdown: `
!!! info
    Content

    \`\`\`shell
    ls -la
    \`\`\`shell

    More content
`,
      errors: [
        {
          lineNumber: 7,
          detail: 'Code block closing tags must not have a language type (use \`\`\` only)'
        }
      ]
    },
    {
      name: 'Valid - empty code block',
      markdown: `
\`\`\`
\`\`\`
`,
      errors: []
    },
    {
      name: 'Valid - code block with no language',
      markdown: `
\`\`\`
some content
\`\`\`
`,
      errors: []
    },
    {
      name: 'Invalid - multiple unclosed blocks',
      markdown: `
\`\`\`python
code1

\`\`\`bash
code2

End without closing either
`,
      errors: [
        {
          lineNumber: 5,
          detail: 'Code block closing tags must not have a language type (use \`\`\` only)'
        }
      ]
    },
    {
      name: 'Valid - indented code blocks',
      markdown: `
Text

    \`\`\`python
    def test():
        pass
    \`\`\`

More text
`,
      errors: []
    },
    {
      name: 'Invalid - indented block with type on closing',
      markdown: `
    \`\`\`ruby
    puts "hello"
    \`\`\`ruby
`,
      errors: [
        {
          lineNumber: 4,
          detail: 'Code block closing tags must not have a language type (use \`\`\` only)'
        }
      ]
    },
    {
      name: 'Valid - nested blocks with different indentation',
      markdown: `
\`\`\`markdown
Text here

    \`\`\`python
    code
    \`\`\`

More markdown
\`\`\`
`,
      errors: []
    },
    {
      name: 'Invalid - wrong closing with spaces after language',
      markdown: `
\`\`\`javascript
const x = 1;
\`\`\`javascript

Text
`,
      errors: [
        {
          lineNumber: 4,
          detail: 'Code block closing tags must not have a language type (use \`\`\` only)'
        }
      ]
    },
    {
      name: 'Invalid - truly nested unclosed blocks',
      markdown: `
\`\`\`markdown
Some text

    \`\`\`python
    code here

End without closing either
`,
      errors: [
        {
          lineNumber: 5,
          detail: 'Code block is not closed (missing closing \`\`\`)'
        },
        {
          lineNumber: 2,
          detail: 'Code block is not closed (missing closing \`\`\`)'
        }
      ]
    }
  ]
};