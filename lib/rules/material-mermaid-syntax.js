// Rule to validate Mermaid diagram syntax in code blocks

module.exports = {
  names: ['material-mermaid-syntax', 'material-mermaid-validation'],
  description: 'Material for MkDocs Mermaid code blocks must contain valid diagram syntax',
  tags: ['material-mkdocs', 'mermaid', 'diagrams', 'error'],
  parser: 'markdownit',
  function: function rule(params, onError) {
    const lines = params.lines;

    let inMermaidBlock = false;
    let mermaidStartLine = -1;
    let mermaidContent = [];

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex];
      const lineNumber = lineIndex + 1;

      // Check for Mermaid code block start
      if (!inMermaidBlock && (line.trim() === '```mermaid' || line.trim() === '``` mermaid')) {
        inMermaidBlock = true;
        mermaidStartLine = lineNumber;
        mermaidContent = [];
        continue;
      }

      // Check for code block end
      if (inMermaidBlock && line.trim() === '```') {
        inMermaidBlock = false;

        // Validate the collected Mermaid content
        validateMermaidSyntax(mermaidContent, mermaidStartLine, onError);

        mermaidContent = [];
        continue;
      }

      // Collect Mermaid content
      if (inMermaidBlock) {
        mermaidContent.push({
          content: line,
          lineNumber: lineNumber
        });
      }
    }

    // Check for unclosed Mermaid block
    if (inMermaidBlock) {
      onError({
        lineNumber: mermaidStartLine,
        detail: 'Mermaid code block is not properly closed with "```".',
        context: '```mermaid'
      });
    }
  }
};

function validateMermaidSyntax(mermaidLines, startLine, onError) {
  if (mermaidLines.length === 0) {
    onError({
      lineNumber: startLine,
      detail: 'Mermaid code block is empty. Add diagram content or remove the block.',
      context: '```mermaid'
    });
    return;
  }

  const contentText = mermaidLines.map(l => l.content.trim()).join('\n');
  const firstLine = mermaidLines[0];

  // Valid Mermaid diagram types
  const validDiagramTypes = [
    'graph', 'flowchart', 'sequenceDiagram', 'classDiagram', 'stateDiagram',
    'erDiagram', 'journey', 'gantt', 'pie', 'requirementDiagram', 'gitgraph'
  ];

  // Check if diagram starts with a valid type
  const hasValidStart = validDiagramTypes.some(type =>
    contentText.toLowerCase().startsWith(type.toLowerCase()) ||
    contentText.toLowerCase().includes(type.toLowerCase())
  );

  if (!hasValidStart) {
    onError({
      lineNumber: firstLine.lineNumber,
      detail: 'Mermaid diagram should start with a valid diagram type (e.g., graph, flowchart, sequenceDiagram, classDiagram, etc.).',
      context: firstLine.content
    });
  }

  // Basic syntax checks

  // Check for flowchart/graph syntax
  if (contentText.toLowerCase().includes('graph') || contentText.toLowerCase().includes('flowchart')) {
    // Check for direction specification
    const directions = ['TD', 'TB', 'BT', 'RL', 'LR'];
    const hasDirection = directions.some(dir => contentText.includes(dir));

    if (!hasDirection) {
      onError({
        lineNumber: firstLine.lineNumber,
        detail: 'Flowchart should specify direction (TD, TB, BT, RL, or LR).',
        context: firstLine.content
      });
    }

    // Check for basic node definitions
    const hasNodes = /[A-Za-z0-9]+\[.*\]/.test(contentText) ||
                    /[A-Za-z0-9]+\(.*\)/.test(contentText) ||
                    /[A-Za-z0-9]+\{.*\}/.test(contentText);

    if (!hasNodes) {
      onError({
        lineNumber: firstLine.lineNumber + 1,
        detail: 'Flowchart should define nodes using brackets [] or parentheses ().',
        context: mermaidLines[1] ? mermaidLines[1].content : firstLine.content
      });
    }
  }

  // Check for sequence diagram syntax
  if (contentText.toLowerCase().includes('sequencediagram')) {
    const hasMessages = /[A-Za-z0-9]+\s*->/.test(contentText) ||
                       /[A-Za-z0-9]+\s*->>/.test(contentText);

    if (!hasMessages) {
      onError({
        lineNumber: firstLine.lineNumber + 1,
        detail: 'Sequence diagram should have message arrows (->) or asynchronous arrows (->>).',
        context: mermaidLines.length > 1 ? mermaidLines[1].content : firstLine.content
      });
    }
  }

  // Check for class diagram syntax
  if (contentText.toLowerCase().includes('classdiagram')) {
    const hasClasses = /class\s+[A-Za-z0-9]+/.test(contentText) ||
                      /[A-Za-z0-9]+\s*:\s*/.test(contentText);

    if (!hasClasses) {
      onError({
        lineNumber: firstLine.lineNumber + 1,
        detail: 'Class diagram should define classes with "class ClassName" or "ClassName : method".',
        context: mermaidLines.length > 1 ? mermaidLines[1].content : firstLine.content
      });
    }
  }

  // Check for gantt chart syntax
  if (contentText.toLowerCase().includes('gantt')) {
    const hasTitle = contentText.includes('title');
    const hasSections = contentText.includes('section');

    if (!hasTitle) {
      onError({
        lineNumber: firstLine.lineNumber + 1,
        detail: 'Gantt chart should have a title line.',
        context: mermaidLines.length > 1 ? mermaidLines[1].content : firstLine.content
      });
    }

    if (!hasSections) {
      onError({
        lineNumber: firstLine.lineNumber + 1,
        detail: 'Gantt chart should have at least one section.',
        context: mermaidLines.length > 1 ? mermaidLines[1].content : firstLine.content
      });
    }
  }

  // Check for common syntax errors
  for (let i = 0; i < mermaidLines.length; i++) {
    const line = mermaidLines[i];
    const content = line.content.trim();

    // Check for unmatched brackets
    const openBrackets = (content.match(/\[/g) || []).length;
    const closeBrackets = (content.match(/\]/g) || []).length;
    const openParens = (content.match(/\(/g) || []).length;
    const closeParens = (content.match(/\)/g) || []).length;
    const openBraces = (content.match(/\{/g) || []).length;
    const closeBraces = (content.match(/\}/g) || []).length;

    if (openBrackets !== closeBrackets) {
      onError({
        lineNumber: line.lineNumber,
        detail: 'Unmatched square brackets in Mermaid diagram.',
        context: content
      });
    }

    if (openParens !== closeParens) {
      onError({
        lineNumber: line.lineNumber,
        detail: 'Unmatched parentheses in Mermaid diagram.',
        context: content
      });
    }

    if (openBraces !== closeBraces) {
      onError({
        lineNumber: line.lineNumber,
        detail: 'Unmatched curly braces in Mermaid diagram.',
        context: content
      });
    }
  }
}