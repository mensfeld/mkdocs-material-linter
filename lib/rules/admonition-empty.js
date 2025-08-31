// Rule to detect empty admonitions (content not properly indented)

module.exports = {
  names: ['material-admonition-empty', 'material-empty-admonition'],
  description: 'Material for MkDocs admonitions must have properly indented content',
  tags: ['material-mkdocs', 'admonitions', 'error'],
  parser: 'markdownit',
  function: function rule(params, onError) {
    const lines = params.lines;
    const admonitionStartRegex = /^(\?\?\?\+?\s+|!!!\s+)\S+/;

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex];

      // Check if this line starts an admonition
      if (admonitionStartRegex.test(line)) {
        const lineNumber = lineIndex + 1;
        let hasContent = false;
        let nextNonEmptyLineIndex = -1;
        let nextNonEmptyLine = '';

        // Look for content in the following lines
        for (let i = lineIndex + 1; i < lines.length; i++) {
          const nextLine = lines[i];
          const trimmedLine = nextLine.trim();

          // Skip empty lines
          if (trimmedLine === '') {
            continue;
          }

          // Found a non-empty line
          nextNonEmptyLineIndex = i;
          nextNonEmptyLine = nextLine;

          // Check if it's properly indented (at least 4 spaces)
          const leadingSpaces = nextLine.match(/^( *)/)[1];
          if (leadingSpaces.length >= 4) {
            hasContent = true;
          }

          // If we hit another admonition or non-indented content, stop
          if (leadingSpaces.length < 4 || admonitionStartRegex.test(nextLine)) {
            break;
          }
        }

        // If no content was found, report an error
        if (!hasContent) {
          let detail = 'Admonition has no content. ';

          // Check if there's content that should be indented
          if (nextNonEmptyLineIndex > -1 && !admonitionStartRegex.test(nextNonEmptyLine)) {
            const leadingSpaces = nextNonEmptyLine.match(/^( *)/)[1];

            if (leadingSpaces.length < 4) {
              detail += `Content on line ${nextNonEmptyLineIndex + 1} needs to be indented with at least 4 spaces to be part of the admonition.`;
            }
          } else {
            detail += 'Add content indented with 4 spaces after the admonition marker.';
          }

          onError({
            lineNumber: lineNumber,
            detail: detail,
            context: line
          });
        }
      }
    }
  }
};
