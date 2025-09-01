// Rule to validate tooltip and annotation syntax for Material for MkDocs

module.exports = {
  names: ['material-tooltip-syntax', 'material-tooltip-validation'],
  description: 'Material for MkDocs tooltip and annotation syntax must be properly formatted',
  tags: ['material-mkdocs', 'tooltips', 'annotations', 'warning'],
  parser: 'markdownit',
  function: function rule(params, onError) {
    const lines = params.lines;

    // Track code block boundaries to skip tooltip validation inside them
    let inCodeBlock = false;

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex];
      const lineNumber = lineIndex + 1;
      const trimmedLine = line.trim();

      // Check for code block boundaries (fenced with ``` or ~~~)
      if (trimmedLine.startsWith('```') || trimmedLine.startsWith('~~~')) {
        inCodeBlock = !inCodeBlock;
        continue;
      }

      // Skip tooltip validation inside code blocks
      if (inCodeBlock) {
        continue;
      }

      // Check for indented code blocks (4+ spaces at start of line)
      const isIndentedCode = line.match(/^    /);
      if (isIndentedCode) {
        continue;
      }

      // Validate markdown link tooltips: [Text](link "Tooltip text")
      const linkTooltipRegex = /\[([^\]]+)\]\(([^)]+)\s*"([^"]*)"\)/g;
      let linkMatch;

      while ((linkMatch = linkTooltipRegex.exec(line)) !== null) {
        const linkText = linkMatch[1];
        const url = linkMatch[2];
        const tooltipText = linkMatch[3];
        const fullMatch = linkMatch[0];

        // Check if tooltip text is empty
        if (!tooltipText.trim()) {
          onError({
            lineNumber: lineNumber,
            detail: 'Tooltip text cannot be empty. Provide descriptive text within quotes.',
            context: fullMatch
          });
        }

        // Check if tooltip text is too short (less than 3 characters)
        if (tooltipText.trim().length < 3) {
          onError({
            lineNumber: lineNumber,
            detail: 'Tooltip text should be descriptive (at least 3 characters).',
            context: fullMatch
          });
        }

        // Check if tooltip text is the same as link text (redundant)
        if (tooltipText.trim().toLowerCase() === linkText.trim().toLowerCase()) {
          onError({
            lineNumber: lineNumber,
            detail: 'Tooltip text should provide additional information, not duplicate the link text.',
            context: fullMatch
          });
        }

        // Check for proper spacing around tooltip quotes (should have space before quote)
        const urlEnd = line.indexOf(url) + url.length;
        const quoteStart = line.indexOf(`"${tooltipText}"`);
        if (urlEnd >= 0 && quoteStart > urlEnd) {
          const beforeQuote = line.substring(urlEnd, quoteStart);
          if (!beforeQuote.includes(' ')) {
            onError({
              lineNumber: lineNumber,
              detail: 'Add a space before the tooltip text in markdown links.',
              context: fullMatch
            });
          }
        }
      }

      // Check for links that should have tooltips but are missing spacing
      const linkWithoutSpaceRegex = /\[([^\]]+)\]\(([^\s)]+)"([^"]*)"\)/g;
      let noSpaceMatch;
      
      while ((noSpaceMatch = linkWithoutSpaceRegex.exec(line)) !== null) {
        const fullMatch = noSpaceMatch[0];
        onError({
          lineNumber: lineNumber,
          detail: 'Add a space before the tooltip text in markdown links.',
          context: fullMatch
        });
      }

      // Validate malformed tooltip syntax
      const malformedTooltips = [
        { pattern: /\[[^\]]+\]\([^)]+\s+'[^']+'\)/, message: 'Use double quotes for tooltip text, not single quotes.' },
        { pattern: /\[[^\]]+\]\([^)]+\s+[^"'][^)]*[^"']\)/, message: 'Tooltip text must be enclosed in quotes.' },
        { pattern: /\[[^\]]+\]\([^)]+\s+"[^"]*$/m, message: 'Unclosed tooltip quote. Make sure to close the tooltip with a quote and parenthesis.' }
      ];

      for (const malformed of malformedTooltips) {
        if (malformed.pattern.test(line)) {
          onError({
            lineNumber: lineNumber,
            detail: malformed.message,
            context: line.trim()
          });
        }
      }

      // Validate hover annotations (Material for MkDocs specific)
      // Pattern for annotations: (1), (2), etc. followed by optional ! or ?
      // Skip annotation validation on markdown headings
      if (!trimmedLine.startsWith('#')) {
        const annotationRegex = /\((\d+)\)([!?]?)/g;
        let annotationMatch;

        while ((annotationMatch = annotationRegex.exec(line)) !== null) {
          const annotationNumber = annotationMatch[1];
          const fullAnnotation = annotationMatch[0];

          // Check for annotation number validity (should be reasonable)
          const num = parseInt(annotationNumber);
          if (num === 0) {
            onError({
              lineNumber: lineNumber,
              detail: 'Annotation numbers should start from 1, not 0.',
              context: fullAnnotation
            });
          }

          if (num > 100) {
            onError({
              lineNumber: lineNumber,
              detail: 'Annotation number seems unusually high. Consider using smaller numbers for better readability.',
              context: fullAnnotation
            });
          }

          // Check for proper spacing around annotations
          const annotationIndex = line.indexOf(fullAnnotation);
          if (annotationIndex > 0) {
            const charBefore = line[annotationIndex - 1];
            if (charBefore !== ' ' && charBefore !== '\t' && charBefore !== '`') {
              // Skip if it's inside backticks (inline code)
              const beforeText = line.substring(0, annotationIndex);
              const backtickCount = (beforeText.match(/`/g) || []).length;
              if (backtickCount % 2 === 0) { // Even number means we're not inside inline code
                onError({
                  lineNumber: lineNumber,
                  detail: 'Add a space before the annotation marker for better readability.',
                  context: fullAnnotation
                });
              }
            }
          }
        }

        // Check for malformed annotations
        const malformedAnnotations = [
          { pattern: /\([a-zA-Z]+\)/, message: 'Annotation markers should use numbers, not letters. Use (1), (2), etc.' },
          { pattern: /\(\)/, message: 'Empty annotation marker. Provide a number like (1) or (2).' },
          { pattern: /\(\d+[^)!?]*[a-zA-Z][^)]*\)/, message: 'Annotation markers should only contain numbers and optional ! or ? modifiers.' }
        ];

        for (const malformed of malformedAnnotations) {
          if (malformed.pattern.test(line)) {
            onError({
              lineNumber: lineNumber,
              detail: malformed.message,
              context: line.trim()
            });
          }
        }
      }
    }
  }
};

