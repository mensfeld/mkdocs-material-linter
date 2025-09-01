/**
 * Tests for material-mermaid-syntax rule
 */
const { lint: markdownlint } = require('markdownlint/sync');
const markdownIt = require('markdown-it');
const materialMermaidSyntaxRule = require('../../lib/rules/material-mermaid-syntax');

function runMaterialMermaidSyntaxTests() {
  console.log('Testing material-mermaid-syntax rule...');

  const tests = [
    // Valid cases
    {
      name: 'Valid flowchart',
      content: `# Flowchart Example

\`\`\`mermaid
flowchart TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Process]
    B -->|No| D[End]
    C --> D
\`\`\``,
      expectedErrors: 0
    },

    {
      name: 'Valid sequence diagram',
      content: `# Sequence Diagram

\`\`\`mermaid
sequenceDiagram
    participant A as Alice
    participant B as Bob
    A->>B: Hello Bob, how are you?
    B-->>A: Great!
\`\`\``,
      expectedErrors: 0
    },

    {
      name: 'Valid class diagram',
      content: `# Class Diagram

\`\`\`mermaid
classDiagram
    class Animal {
        +name: string
        +age: int
        +makeSound()
    }
    class Dog {
        +breed: string
        +bark()
    }
    Animal <|-- Dog
\`\`\``,
      expectedErrors: 0
    },

    // Invalid cases
    {
      name: 'Empty mermaid block',
      content: `# Empty Block

\`\`\`mermaid
\`\`\``,
      expectedErrors: 1
    },

    {
      name: 'Unclosed mermaid block',
      content: `# Unclosed Block

\`\`\`mermaid
flowchart TD
    A --> B`,
      expectedErrors: 1
    },

    {
      name: 'Invalid diagram type',
      content: `# Invalid Diagram

\`\`\`mermaid
invalidDiagram
    A --> B
\`\`\``,
      expectedErrors: 1
    },

    {
      name: 'Flowchart without direction',
      content: `# Flowchart No Direction

\`\`\`mermaid
flowchart
    A --> B
\`\`\``,
      expectedErrors: 1
    },

    {
      name: 'Flowchart without nodes',
      content: `# Flowchart No Nodes

\`\`\`mermaid
flowchart TD
\`\`\``,
      expectedErrors: 1
    },

    {
      name: 'Sequence diagram without messages',
      content: `# Sequence No Messages

\`\`\`mermaid
sequenceDiagram
    participant A
    participant B
\`\`\``,
      expectedErrors: 1
    },

    {
      name: 'Gantt without title',
      content: `# Gantt No Title

\`\`\`mermaid
gantt
    section Development
    Task 1: 2023-01-01, 30d
\`\`\``,
      expectedErrors: 1
    },

    {
      name: 'Gantt without sections',
      content: `# Gantt No Sections

\`\`\`mermaid
gantt
    title Project Timeline
\`\`\``,
      expectedErrors: 1
    },

    {
      name: 'Unmatched brackets',
      content: `# Unmatched Brackets

\`\`\`mermaid
flowchart TD
    A[Start --> B[End]
\`\`\``,
      expectedErrors: 1
    },

    {
      name: 'Unmatched parentheses',
      content: `# Unmatched Parentheses

\`\`\`mermaid
flowchart TD
    A(Start --> B(End)
\`\`\``,
      expectedErrors: 1
    },

    {
      name: 'Mixed valid and invalid',
      content: `# Mixed Content

\`\`\`mermaid
flowchart TD
    A[Start] --> B{Decision}
\`\`\`

\`\`\`mermaid
invalidDiagram
    C --> D
\`\`\``,
      expectedErrors: 1
    }
  ];

  let passed = 0;
  let total = tests.length;

  tests.forEach((test, index) => {
    const options = {
      strings: { [`test-${index}`]: test.content },
      customRules: [materialMermaidSyntaxRule],
      config: { 
        'default': false,
        'material-mermaid-syntax': true 
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
    console.log(`Material Mermaid Syntax Tests: ${passed}/${total} passed\n`);
  }, 100);
}

module.exports = { runMaterialMermaidSyntaxTests };

// Run if executed directly
if (require.main === module) {
  runMaterialMermaidSyntaxTests();
}