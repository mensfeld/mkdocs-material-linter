module.exports = {
  names: ['material-list-auto-numbering', 'list-auto-numbering'],
  description: 'Ensures ordered lists starting with 1. use "1." for all items to enable auto-numbering',
  tags: ['material-mkdocs', 'lists', 'auto-numbering'],
  parser: 'markdownit',
  function: function rule(params, onError) {
    const lines = params.lines;
    const orderedListRegex = /^(\s*)(\d+)\.\s+/;

    let inCodeBlock = false;
    let inAdmonition = false;
    let currentListIndent = null;
    let listStartNumber = null;

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex];
      const lineNumber = lineIndex + 1;
      const trimmedLine = line.trim();

      // Track code blocks
      if (/^```/.test(trimmedLine)) {
        inCodeBlock = !inCodeBlock;
        continue;
      }

      // Skip checks inside code blocks
      if (inCodeBlock) {
        continue;
      }

      // Track admonition blocks
      if (/^(\?\?\?\+?\s+|!!!\s+)\S+/.test(line)) {
        inAdmonition = true;
        continue;
      }

      // Check if we're still in admonition
      if (inAdmonition) {
        const leadingSpaces = line.match(/^( *)/)[1].length;
        if (trimmedLine !== '' && leadingSpaces < 4) {
          inAdmonition = false;
        }
      }

      // Check for ordered list items
      const match = line.match(orderedListRegex);

      if (match) {
        const indent = match[1].length;
        const number = parseInt(match[2], 10);

        // If this is a new list (different indent or first item)
        if (currentListIndent === null || indent !== currentListIndent || trimmedLine === '') {
          currentListIndent = indent;
          listStartNumber = number;
        }

        // Only check lists that start with 1
        if (listStartNumber === 1 && number !== 1) {
          const prefix = match[1]; // indentation

          onError({
            lineNumber: lineNumber,
            detail: `Ordered list items should use "1." for auto-numbering (found "${number}.")`,
            fixInfo: {
              editColumn: prefix.length + 1,
              deleteCount: match[2].length,
              insertText: '1'
            }
          });
        }
      } else if (trimmedLine === '' || (!orderedListRegex.test(line) && !/^(\s*)-\s+/.test(line))) {
        // Reset list tracking when we encounter a blank line or non-list content
        currentListIndent = null;
        listStartNumber = null;
      }
    }
  }
};
