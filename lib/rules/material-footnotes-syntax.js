// Rule to validate footnote syntax for Material for MkDocs

module.exports = {
  names: ['material-footnotes-syntax', 'material-footnote-validation'],
  description: 'Material for MkDocs footnotes must use proper syntax with matching references and definitions',
  tags: ['material-mkdocs', 'footnotes', 'error'],
  parser: 'markdownit',
  function: function rule(params, onError) {
    const lines = params.lines;

    const footnoteReferences = new Map(); // Map of footnote ID to line numbers where referenced
    const footnoteDefinitions = new Map(); // Map of footnote ID to definition line number

    // Track code block boundaries to skip footnote validation inside them
    let inCodeBlock = false;

    // First pass: collect all footnote references and definitions
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex];
      const lineNumber = lineIndex + 1;
      const trimmedLine = line.trim();

      // Check for code block boundaries (fenced with ``` or indented code blocks)
      if (trimmedLine.startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        continue;
      }

      // Skip footnote validation inside code blocks
      if (inCodeBlock) {
        continue;
      }

      // A footnote definition starts a line with [^id]. A well-formed one has a
      // colon ([^id]: content); a colon-less one ([^id] content) is malformed
      // but still intended as a definition (flagged in the third pass), so we
      // treat it as a definition here too.
      const defStartMatch = line.match(/^\[\^([a-zA-Z0-9\-_]+)\]/);
      const isDefinition = defStartMatch !== null;

      // Find footnote references: [^1], [^note], [^my-note]. On a definition
      // line, skip its own leading label so it isn't counted as a reference to
      // itself (which would hide "definition never referenced" and inflate
      // "reference has no definition" errors).
      const referenceScan = isDefinition ? line.slice(defStartMatch[0].length) : line;
      const referenceRegex = /\[\^([a-zA-Z0-9\-_]+)\]/g;
      let match;

      while ((match = referenceRegex.exec(referenceScan)) !== null) {
        const footnoteId = match[1];

        if (!footnoteReferences.has(footnoteId)) {
          footnoteReferences.set(footnoteId, []);
        }
        footnoteReferences.get(footnoteId).push(lineNumber);
      }

      // Register footnote definitions (well-formed and malformed alike).
      if (isDefinition) {
        const footnoteId = defStartMatch[1];

        if (footnoteDefinitions.has(footnoteId)) {
          // Duplicate definition
          onError({
            lineNumber: lineNumber,
            detail: `Duplicate footnote definition for "[^${footnoteId}]". Each footnote can only be defined once.`,
            context: line
          });
        } else {
          footnoteDefinitions.set(footnoteId, lineNumber);

          // Check if a well-formed "[^id]:" definition has content.
          const wellFormedMatch = line.match(/^\[\^[a-zA-Z0-9\-_]+\]:\s*(.*)$/);
          if (wellFormedMatch && !wellFormedMatch[1].trim()) {
            onError({
              lineNumber: lineNumber,
              detail: `Footnote definition "[^${footnoteId}]" is empty. Add content after the colon.`,
              context: line
            });
          }
        }
      }
    }

    // Second pass: validate references have definitions and vice versa
    for (const [footnoteId, referenceLines] of footnoteReferences) {
      if (!footnoteDefinitions.has(footnoteId)) {
        // Reference without definition
        referenceLines.forEach(lineNumber => {
          onError({
            lineNumber: lineNumber,
            detail: `Footnote reference "[^${footnoteId}]" has no matching definition. Add "[^${footnoteId}]: content" somewhere in the document.`,
            context: lines[lineNumber - 1]
          });
        });
      }
    }

    for (const [footnoteId, definitionLine] of footnoteDefinitions) {
      if (!footnoteReferences.has(footnoteId)) {
        // Definition without reference
        onError({
          lineNumber: definitionLine,
          detail: `Footnote definition "[^${footnoteId}]" is never referenced. Either add a reference "[^${footnoteId}]" in the text or remove this definition.`,
          context: lines[definitionLine - 1]
        });
      }
    }

    // Third pass: validate footnote definition formatting and content
    inCodeBlock = false; // Reset code block tracking
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex];
      const lineNumber = lineIndex + 1;
      const trimmedLine = line.trim();

      // Check for code block boundaries (fenced with ``` or indented code blocks)
      if (trimmedLine.startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        continue;
      }

      // Skip footnote validation inside code blocks
      if (inCodeBlock) {
        continue;
      }

      // Check for malformed footnote definitions
      if (line.match(/^\[\^[a-zA-Z0-9\-_]*\]/)) {
        // Looks like footnote definition but might be malformed
        if (!line.includes(':')) {
          onError({
            lineNumber: lineNumber,
            detail: 'Footnote definition is missing colon (:). Use format "[^id]: content".',
            context: line
          });
        } else {
          // Check for proper spacing after colon
          const colonMatch = line.match(/^\[\^[a-zA-Z0-9\-_]+\]:(.*)$/);
          if (colonMatch && !colonMatch[1].startsWith(' ') && colonMatch[1].trim() !== '') {
            onError({
              lineNumber: lineNumber,
              detail: 'Add a space after the colon in footnote definition.',
              context: line
            });
          }
        }
      }

      // Check for invalid footnote reference patterns
      const invalidReferences = [
        { pattern: /\[\^[^\]]*\s[^\]]*\]/, message: 'Footnote IDs cannot contain spaces. Use hyphens or underscores instead.' },
        { pattern: /\[\^\]/, message: 'Footnote reference cannot be empty. Provide an ID like [^1] or [^note].' },
        { pattern: /\[\^[^a-zA-Z0-9\-_][^\]]*\]/, message: 'Footnote IDs should only contain letters, numbers, hyphens, and underscores.' }
      ];

      for (const invalid of invalidReferences) {
        if (invalid.pattern.test(line)) {
          onError({
            lineNumber: lineNumber,
            detail: invalid.message,
            context: line
          });
        }
      }
    }

    // Check for numeric footnote ordering (optional best practice)
    const numericFootnotes = Array.from(footnoteReferences.keys())
      .filter(id => /^\d+$/.test(id))
      .map(id => parseInt(id))
      .sort((a, b) => a - b);

    if (numericFootnotes.length > 1) {
      for (let i = 0; i < numericFootnotes.length; i++) {
        const expected = i + 1;
        const actual = numericFootnotes[i];

        if (actual !== expected) {
          const firstReferenceLine = footnoteReferences.get(actual.toString())[0];
          onError({
            lineNumber: firstReferenceLine,
            detail: `Numeric footnotes should be sequential. Expected [^${expected}] but found [^${actual}].`,
            context: lines[firstReferenceLine - 1]
          });
          break; // Only report the first ordering issue
        }
      }
    }
  }
};