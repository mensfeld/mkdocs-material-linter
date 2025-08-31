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
          
          // Check if this is a new admonition
          if (admonitionStartRegex.test(line)) {
            inAdmonition = true;
            lastNonEmptyLineWasAdmonition = true;
          }
          continue;
        }
        
        // Check for tabs
        if (line.startsWith('\t') || line.match(/^[ ]*\t/)) {
          onError({
            lineNumber: lineNumber,
            detail: 'Admonition content must use spaces, not tabs',
            context: line,
            fixInfo: {
              lineNumber: lineNumber,
              editColumn: 1,
              deleteCount: line.length,
              insertText: '    ' + line.replace(/^\s+/, '')
            }
          });
          continue;
        }
        
        // Check if indentation is exactly 4 spaces (or multiples for nested content)
        if (spacesCount % 4 !== 0) {
          const correctSpaces = Math.ceil(spacesCount / 4) * 4;
          const spacesToAdd = ' '.repeat(correctSpaces);
          
          onError({
            lineNumber: lineNumber,
            detail: `Admonition content must use 4-space indentation (found ${spacesCount} spaces)`,
            context: line,
            fixInfo: {
              lineNumber: lineNumber,
              editColumn: 1,
              deleteCount: line.length,
              insertText: spacesToAdd + line.trimStart()
            }
          });
          continue;
        }
        
        // For the first content line, check if it has exactly 4 spaces
        if (lastNonEmptyLineWasAdmonition && spacesCount !== 4 && spacesCount !== 0) {
          if (spacesCount > 4 && spacesCount % 4 === 0) {
            // This might be intentionally nested content, so just warn
            return;
          }
          
          onError({
            lineNumber: lineNumber,
            detail: `First line of admonition content should have exactly 4 spaces (found ${spacesCount})`,
            context: line,
            fixInfo: {
              lineNumber: lineNumber,
              editColumn: 1,
              deleteCount: line.length,
              insertText: '    ' + line.trimStart()
            }
          });
        }
        
        lastNonEmptyLineWasAdmonition = false;
      }
    }
  }
};