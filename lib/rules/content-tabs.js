// No longer using markdownlint-rule-helpers for this rule

module.exports = {
  names: ['material-content-tabs', 'material-tabs'],
  description: 'Material for MkDocs content tabs must use correct === delimiter syntax',
  tags: ['material-mkdocs', 'tabs', 'error'],
  parser: 'markdownit',
  function: function rule(params, onError) {
    const lines = params.lines;

    // Regex patterns
    const tabDelimiterRegex = /^(=+)\s*"([^"]+)"\s*$/;
    const invalidTabRegex = /^(=+)\s*([^"]+)\s*$/; // Tab without quotes
    const partialTabRegex = /^=+\s/; // Lines starting with = and space

    let inTabGroup = false;
    // let tabGroupStart = 0; // Not used in current implementation
    let expectedTabContent = false;
    let tabNestingLevel = 0;

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex];
      const lineNumber = lineIndex + 1;
      const trimmedLine = line.trim();

      // Skip empty lines
      if (trimmedLine === '') {
        return;
      }

      // Check for tab delimiter
      const tabMatch = trimmedLine.match(tabDelimiterRegex);
      const invalidTabMatch = trimmedLine.match(invalidTabRegex);

      if (tabMatch) {
        const delimiters = tabMatch[1];
        const tabTitle = tabMatch[2];

        // Check if using exactly === (three equals)
        if (delimiters.length !== 3) {
          onError({
            lineNumber: lineNumber,
            detail: `Content tabs must use exactly "===" delimiter (found ${delimiters.length} equals)`,
            context: line,
            fixInfo: {
              lineNumber: lineNumber,
              editColumn: 1,
              deleteCount: line.length,
              insertText: `=== "${tabTitle}"`
            }
          });
          return;
        }

        // Check tab title length (should be reasonable)
        if (tabTitle.length > 50) {
          onError({
            lineNumber: lineNumber,
            detail: `Tab title is too long (${tabTitle.length} chars). Keep under 50 characters for better UX`,
            context: line
          });
        }

        // Check for empty tab title
        if (tabTitle.trim() === '') {
          onError({
            lineNumber: lineNumber,
            detail: 'Tab title cannot be empty',
            context: line
          });
        }

        if (!inTabGroup) {
          inTabGroup = true;
          // tabGroupStart = lineNumber; // Not used in current implementation
          tabNestingLevel = 0;
        }

        expectedTabContent = true;
        return;
      }

      // Check for invalid tab format (missing quotes)
      if (invalidTabMatch && !tabMatch) {
        const delimiters = invalidTabMatch[1];
        const title = invalidTabMatch[2];

        // Only flag if it looks like a tab delimiter (starts with ===)
        if (delimiters.startsWith('===')) {
          onError({
            lineNumber: lineNumber,
            detail: `Tab title must be quoted. Use === "${title.trim()}" instead`,
            context: line,
            fixInfo: {
              lineNumber: lineNumber,
              editColumn: 1,
              deleteCount: line.length,
              insertText: `=== "${title.trim()}"`
            }
          });
          return;
        }
      }

      // Check for partial tab patterns that might be typos
      if (partialTabRegex.test(trimmedLine) && !tabMatch && !invalidTabMatch) {
        // This might be a malformed tab
        if (trimmedLine.startsWith('== ') || trimmedLine.startsWith('==== ')) {
          onError({
            lineNumber: lineNumber,
            detail: 'Possible malformed tab delimiter. Use === "Title" for content tabs',
            context: line
          });
        }
        return;
      }

      // If we're in a tab group, check content indentation
      if (inTabGroup) {
        const leadingSpaces = line.match(/^( *)/)[1].length;

        // Content should be indented (at least 4 spaces for first level)
        if (expectedTabContent) {
          if (leadingSpaces === 0 && !partialTabRegex.test(line)) {
            // This line is not indented and not a tab, so tab group might have ended
            inTabGroup = false;
            expectedTabContent = false;
            tabNestingLevel = 0;
            return;
          }

          // Check for proper indentation (should be multiple of 4)
          if (leadingSpaces > 0 && leadingSpaces % 4 !== 0) {
            onError({
              lineNumber: lineNumber,
              detail: `Tab content should use 4-space indentation (found ${leadingSpaces} spaces)`,
              context: line,
              fixInfo: {
                lineNumber: lineNumber,
                editColumn: 1,
                deleteCount: line.length,
                insertText: '    '.repeat(Math.ceil(leadingSpaces / 4)) + line.trimStart()
              }
            });
            return;
          }

          expectedTabContent = false;
        }

        // Check for nested tabs (not recommended)
        if (tabMatch && tabNestingLevel > 0) {
          onError({
            lineNumber: lineNumber,
            detail: 'Nested content tabs are not supported. Use separate tab groups instead',
            context: line
          });
        }

        // Track nesting level based on indentation
        if (leadingSpaces >= 4) {
          tabNestingLevel = Math.floor(leadingSpaces / 4);
        }
      }

      // Check for standalone equals that might be markdown heading underlines
      if (/^=+$/.test(trimmedLine) && trimmedLine.length > 2) {
        // This could be confused with tab delimiters
        onError({
          lineNumber: lineNumber,
          detail: 'If this is intended as a tab delimiter, use === "Title" format. For markdown headings, use # syntax instead of underlines',
          context: line
        });
      }
    }
  }
};
