// Rule to validate LaTeX/MathJax syntax for Material for MkDocs math extension

module.exports = {
  names: ['material-math-blocks', 'material-math-validation'],
  description: 'Material for MkDocs math blocks must use proper LaTeX/MathJax syntax with correct delimiters',
  tags: ['material-mkdocs', 'math', 'latex', 'mathjax', 'error'],
  parser: 'markdownit',
  function: function rule(params, onError) {
    const lines = params.lines;

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex];
      const lineNumber = lineIndex + 1;

      // Check for inline math: $...$
      const inlineMathRegex = /\$([^$\n]+)\$/g;
      let inlineMatch;

      while ((inlineMatch = inlineMathRegex.exec(line)) !== null) {
        const mathContent = inlineMatch[1];
        const fullMatch = inlineMatch[0];

        // Validate inline math content
        validateMathSyntax(mathContent, lineNumber, fullMatch, 'inline', onError);
      }

      // Check for block math: $$...$$ (single line)
      const blockMathSingleLineRegex = /\$\$([^$\n]+)\$\$/g;
      let blockMatch;

      while ((blockMatch = blockMathSingleLineRegex.exec(line)) !== null) {
        const mathContent = blockMatch[1];
        const fullMatch = blockMatch[0];

        // Validate block math content
        validateMathSyntax(mathContent, lineNumber, fullMatch, 'block', onError);
      }

      // Check for opening block math delimiter on its own line
      if (line.trim() === '$$') {
        let closingFound = false;
        let mathLines = [];

        // Look for closing delimiter
        for (let i = lineIndex + 1; i < lines.length; i++) {
          if (lines[i].trim() === '$$') {
            closingFound = true;

            // Validate multi-line math block content
            const mathContent = mathLines.join('\n');
            if (mathContent.trim() === '') {
              onError({
                lineNumber: lineNumber,
                detail: 'Math block is empty. Add mathematical content between the $$ delimiters.',
                context: '$$'
              });
            } else {
              validateMathSyntax(mathContent, lineNumber, `$$\n${mathContent}\n$$`, 'block', onError);
            }
            break;
          } else {
            mathLines.push(lines[i]);
          }
        }

        if (!closingFound) {
          onError({
            lineNumber: lineNumber,
            detail: 'Math block is not properly closed with $$.',
            context: '$$'
          });
        }
      }

      // Check for common markdown-math conflicts
      if (line.includes('$') && !line.match(/\$[^$\n]+\$/) && !line.trim().startsWith('$$')) {
        // Single $ that's not part of math
        const singleDollarMatches = line.match(/[^$]\$[^$\s]/g);
        if (singleDollarMatches) {
          onError({
            lineNumber: lineNumber,
            detail: 'Single $ may conflict with math syntax. Use $$ for block math or escape with \\$ if literal.',
            context: line
          });
        }
      }

      // Check for LaTeX environments without proper delimiters
      const latexEnvironments = ['align', 'equation', 'gather', 'split', 'multline', 'cases', 'matrix', 'pmatrix', 'bmatrix', 'vmatrix', 'Vmatrix'];

      for (const env of latexEnvironments) {
        const beginPattern = new RegExp(`\\\\begin\\{${env}\\}`);

        if (beginPattern.test(line)) {
          // Check if it's inside math delimiters
          const beforeBegin = line.substring(0, line.search(beginPattern));
          const hasOpeningDelimiter = beforeBegin.includes('$$') || beforeBegin.includes('$');

          if (!hasOpeningDelimiter) {
            onError({
              lineNumber: lineNumber,
              detail: `LaTeX environment \\begin{${env}} should be inside math delimiters ($$ or $).`,
              context: line
            });
          }
        }
      }
    }
  }
};

function validateMathSyntax(mathContent, lineNumber, context, type, onError) {
  // Check for empty math
  if (mathContent.trim() === '') {
    onError({
      lineNumber: lineNumber,
      detail: `Empty ${type} math block. Add mathematical content or remove the delimiters.`,
      context: context
    });
    return;
  }

  // Check for unmatched braces
  const openBraces = (mathContent.match(/\{/g) || []).length;
  const closeBraces = (mathContent.match(/\}/g) || []).length;

  if (openBraces !== closeBraces) {
    onError({
      lineNumber: lineNumber,
      detail: `Unmatched braces in ${type} math. Check that all { have corresponding }.`,
      context: context
    });
  }

  // Check for unmatched parentheses
  const openParens = (mathContent.match(/\(/g) || []).length;
  const closeParens = (mathContent.match(/\)/g) || []).length;

  if (openParens !== closeParens) {
    onError({
      lineNumber: lineNumber,
      detail: `Unmatched parentheses in ${type} math. Check that all ( have corresponding ).`,
      context: context
    });
  }

  // Check for unmatched square brackets
  const openBrackets = (mathContent.match(/\[/g) || []).length;
  const closeBrackets = (mathContent.match(/\]/g) || []).length;

  if (openBrackets !== closeBrackets) {
    onError({
      lineNumber: lineNumber,
      detail: `Unmatched square brackets in ${type} math. Check that all [ have corresponding ].`,
      context: context
    });
  }

  // Check for common LaTeX command errors
  const commonCommands = {
    '\\frac': 'should have two arguments: \\frac{numerator}{denominator}',
    '\\sqrt': 'should have content: \\sqrt{content} or \\sqrt[n]{content}',
    '\\sum': 'often used with limits: \\sum_{i=1}^{n}',
    '\\int': 'often used with limits: \\int_{a}^{b}',
    '\\lim': 'should specify what approaches what: \\lim_{x \\to \\infty}'
  };

  for (const [command, suggestion] of Object.entries(commonCommands)) {
    if (mathContent.includes(command)) {
      // Basic validation for frac
      if (command === '\\frac') {
        const fracPattern = /\\frac\{[^}]*\}\{[^}]*\}/;
        if (!fracPattern.test(mathContent)) {
          onError({
            lineNumber: lineNumber,
            detail: `\\frac ${suggestion}`,
            context: context
          });
        }
      }

      // Basic validation for sqrt
      if (command === '\\sqrt') {
        const sqrtPattern = /\\sqrt(\[[^\]]*\])?\{[^}]*\}/;
        if (!sqrtPattern.test(mathContent)) {
          onError({
            lineNumber: lineNumber,
            detail: `\\sqrt ${suggestion}`,
            context: context
          });
        }
      }
    }
  }

  // Check for environments that need to be properly closed
  const environments = ['align', 'equation', 'gather', 'split', 'multline', 'cases'];

  for (const env of environments) {
    const beginCount = (mathContent.match(new RegExp(`\\\\begin\\{${env}\\}`, 'g')) || []).length;
    const endCount = (mathContent.match(new RegExp(`\\\\end\\{${env}\\}`, 'g')) || []).length;

    if (beginCount !== endCount) {
      onError({
        lineNumber: lineNumber,
        detail: `Unmatched \\begin{${env}} and \\end{${env}} in math block.`,
        context: context
      });
    }
  }

  // Check for inline math that should be block math
  if (type === 'inline' && mathContent.length > 50) {
    onError({
      lineNumber: lineNumber,
      detail: 'Long mathematical expression should use block math ($$) instead of inline math ($).',
      context: context
    });
  }

  // Check for display math commands in inline context
  if (type === 'inline') {
    const displayCommands = ['\\displaystyle', '\\begin{align}', '\\begin{equation}'];
    for (const cmd of displayCommands) {
      if (mathContent.includes(cmd)) {
        onError({
          lineNumber: lineNumber,
          detail: `${cmd} should be used in block math ($$) rather than inline math ($).`,
          context: context
        });
      }
    }
  }

  // Warn about potential markdown conflicts
  if (mathContent.includes('_') && !mathContent.includes('\\_')) {
    const underscoreCount = (mathContent.match(/_/g) || []).length;
    if (underscoreCount % 2 !== 0) {
      onError({
        lineNumber: lineNumber,
        detail: 'Uneven number of underscores in math may conflict with markdown emphasis. Consider escaping with \\_.',
        context: context
      });
    }
  }

  if (mathContent.includes('*') && !mathContent.includes('\\*')) {
    const asteriskCount = (mathContent.match(/\*/g) || []).length;
    if (asteriskCount % 2 !== 0) {
      onError({
        lineNumber: lineNumber,
        detail: 'Uneven number of asterisks in math may conflict with markdown emphasis. Consider escaping with \\*.',
        context: context
      });
    }
  }
}