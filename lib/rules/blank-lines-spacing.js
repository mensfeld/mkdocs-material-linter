module.exports = {
  names: ['material-blank-lines-spacing', 'material-blank-lines'],
  description: 'Ensures blank lines before and after headers and after code blocks',
  tags: ['material-mkdocs', 'spacing', 'blank-lines'],
  parser: 'markdownit',
  function: function rule(params, onError) {
    const lines = params.lines;
    const headerRegex = /^#{1,6}\s+/;
    const codeBlockEndRegex = /^```/;

    let inCodeBlock = false;
    let inAdmonition = false;
    let admonitionIndent = 0;

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex];
      const lineNumber = lineIndex + 1;
      const trimmedLine = line.trim();
      const nextLine = lineIndex < lines.length - 1 ? lines[lineIndex + 1] : null;
      const prevLine = lineIndex > 0 ? lines[lineIndex - 1] : null;

      // Track admonition blocks
      if (/^(\?\?\?\+?\s+|!!!\s+)\S+/.test(line)) {
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

      // Track code blocks
      if (codeBlockEndRegex.test(trimmedLine)) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          continue;
        } else {
          // Code block is ending
          inCodeBlock = false;

          // Check if there's a blank line after the code block
          // Skip if it's the last line or if we're inside an admonition
          if (!inAdmonition && nextLine !== null && nextLine.trim() !== '') {
            // Check if next line is a header (which has its own spacing rules)
            if (!headerRegex.test(nextLine.trim())) {
              onError({
                lineNumber: lineNumber + 1,
                detail: 'Code blocks should be followed by a blank line',
                fixInfo: {
                  lineNumber: lineNumber + 1,
                  insertText: '\n'
                }
              });
            }
          }
          continue;
        }
      }

      // Skip checks inside code blocks
      if (inCodeBlock) {
        continue;
      }

      // Check headers (skip if inside admonition)
      if (!inAdmonition && headerRegex.test(trimmedLine)) {
        // Check blank line before header (unless it's the first line or previous line is a header)
        if (lineIndex > 0 && prevLine !== null && prevLine.trim() !== '' && !headerRegex.test(prevLine.trim())) {
          onError({
            lineNumber: lineNumber,
            detail: 'Headers should be preceded by a blank line',
            fixInfo: {
              lineNumber: lineNumber,
              insertText: '\n'
            }
          });
        }

        // Check blank line after header (unless it's the last line)
        if (nextLine !== null && nextLine.trim() !== '') {
          // Don't require blank line if next line is another header
          if (!headerRegex.test(nextLine.trim())) {
            onError({
              lineNumber: lineNumber + 1,
              detail: 'Headers should be followed by a blank line',
              fixInfo: {
                lineNumber: lineNumber + 1,
                insertText: '\n'
              }
            });
          }
        }
      }
    }
  }
};