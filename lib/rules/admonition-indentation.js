// Not using markdownlint-rule-helpers anymore

module.exports = {
  names: ['material-admonition-indentation', 'material-admonition-indent'],
  description: 'Material for MkDocs admonition content must use exactly 4-space indentation',
  tags: ['material-mkdocs', 'admonitions', 'indentation', 'error'],
  parser: 'markdownit',
  function: function rule(params, onError) {
    const lines = params.lines;
    const admonitionStartRegex = /^(\?\?\?\+?\s+|!!!\s+)\S+/;

    let inAdmonition = false;
    // admonitionStartLine is not needed in current implementation
    let lastNonEmptyLineWasAdmonition = false;
    let inCodeBlock = false;

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex];
      const lineNumber = lineIndex + 1;
      const trimmedLine = line.trim();

      // Check if this line starts an admonition
      if (admonitionStartRegex.test(line)) {
        inAdmonition = true;
        lastNonEmptyLineWasAdmonition = true;
        continue;
      }

      // If we're in an admonition block
      if (inAdmonition) {
        // Empty lines are allowed within admonitions
        if (trimmedLine === '') {
          continue;
        }

        // Check if the line is part of the admonition content
        // (must start with at least 4 spaces)
        const leadingSpaces = line.match(/^( *)/)[1];
        const spacesCount = leadingSpaces.length;

        // If line has content and doesn't start with at least 4 spaces,
        // the admonition block has ended
        if (spacesCount < 4) {
          inAdmonition = false;
          lastNonEmptyLineWasAdmonition = false;
          inCodeBlock = false;

          // Check if this is a new admonition
          if (admonitionStartRegex.test(line)) {
            inAdmonition = true;
            lastNonEmptyLineWasAdmonition = true;
          }
          continue;
        }

        // Check for code block boundaries (fenced with ``` or indented code blocks)
        const contentAfterSpaces = line.substring(spacesCount);
        if (contentAfterSpaces.startsWith('```')) {
          inCodeBlock = !inCodeBlock;
          // Code block fences should follow normal indentation rules
        }

        // Skip indentation checks for content inside code blocks
        if (inCodeBlock && !contentAfterSpaces.startsWith('```')) {
          continue;
        }

        // Check for tabs
        if (line.startsWith('\t') || line.match(/^[ ]*\t/)) {
          onError({
            lineNumber: lineNumber,
            detail: 'Admonition content must use spaces, not tabs',
            context: line
          });
          continue;
        }

        // Check if indentation is even number of spaces (minimum 4, then 6, 8, etc.)
        if (spacesCount < 4 || spacesCount % 2 !== 0) {
          onError({
            lineNumber: lineNumber,
            detail: `Admonition content must use even number of spaces with minimum 4 (found ${spacesCount} spaces)`,
            context: line
          });
          continue;
        }

        // For the first content line, check if it has exactly 4 spaces or is appropriately indented
        if (lastNonEmptyLineWasAdmonition && spacesCount !== 4 && spacesCount !== 0) {
          if (spacesCount < 4 || spacesCount % 2 !== 0) {
            onError({
              lineNumber: lineNumber,
              detail: `First line of admonition content should have exactly 4 spaces or appropriate even indentation for nested content (found ${spacesCount})`,
              context: line
            });
          }
          // Note: We don't return here - continue processing the rest of the file
        }

        lastNonEmptyLineWasAdmonition = false;
      }
    }
  }
};
