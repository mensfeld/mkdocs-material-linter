module.exports = {
  names: ['material-code-block-syntax', 'material-code-blocks'],
  description: 'Code blocks must have proper syntax - no type on closing tag and all blocks must be closed',
  tags: ['material-mkdocs', 'code', 'syntax', 'error'],
  parser: 'markdownit',
  function: function rule(params, onError) {
    const lines = params.lines;
    const codeBlockRegex = /^(\s*)```(.*)$/;
    const admonitionRegex = /^(\?\?\?\+?\s+|!!!\s+)\S+/;

    // Stack to track open code blocks with their line numbers and indentation
    const codeBlockStack = [];
    let inAdmonition = false;
    let admonitionIndent = 0;

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex];
      const lineNumber = lineIndex + 1;
      const trimmedLine = line.trim();

      // Track admonition blocks to handle nested code blocks properly
      if (admonitionRegex.test(line)) {
        inAdmonition = true;
        admonitionIndent = 0;
        continue;
      }

      // Check if we're still in admonition
      if (inAdmonition) {
        const leadingSpaces = line.match(/^( *)/)[1].length;
        if (trimmedLine !== '' && leadingSpaces < 4) {
          inAdmonition = false;
          admonitionIndent = 0;
        } else if (trimmedLine !== '') {
          admonitionIndent = Math.min(leadingSpaces, admonitionIndent || leadingSpaces);
        }
      }

      // Check for code block delimiters
      const codeBlockMatch = line.match(codeBlockRegex);
      if (codeBlockMatch) {
        const indent = codeBlockMatch[1].length;
        const afterTicks = codeBlockMatch[2];

        // Determine if this is opening or closing based on stack and indentation
        let isClosing = false;

        // Check if this could be a closing tag
        if (codeBlockStack.length > 0) {
          const lastBlock = codeBlockStack[codeBlockStack.length - 1];

          // Check if this is likely a closing tag based on indentation and content
          if (inAdmonition) {
            // In admonitions, exact indent match means closing
            if (indent === lastBlock.indent) {
              isClosing = true;
            }
          } else {
            // Outside admonitions
            if (indent === lastBlock.indent) {
              // Same indentation as opening - likely a closing tag
              // Even if it has a language, we'll treat it as a malformed closing
              isClosing = true;
            } else if (indent < lastBlock.indent && afterTicks.trim() === '') {
              // Less indentation with plain ``` - also a closing tag
              isClosing = true;
            }
            // Greater indentation = nested block (new opening)
          }
        }

        if (isClosing) {
          // This is a closing tag
          if (afterTicks.trim() !== '') {
            onError({
              lineNumber: lineNumber,
              detail: 'Code block closing tags must not have a language type (use ``` only)',
              context: line,
              fixInfo: {
                lineNumber: lineNumber,
                deleteCount: 1,
                insertText: codeBlockMatch[1] + '```\n'
              }
            });
          }

          // Pop from stack
          codeBlockStack.pop();
        } else {
          // This is an opening tag
          codeBlockStack.push({
            lineNumber: lineNumber,
            indent: indent,
            line: line.trim()
          });
        }
      }
    }

    // Check for unclosed code blocks
    while (codeBlockStack.length > 0) {
      const unclosed = codeBlockStack.pop();
      onError({
        lineNumber: unclosed.lineNumber,
        detail: 'Code block is not closed (missing closing ```)',
        context: unclosed.line
      });
    }
  }
};