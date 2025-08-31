// Using direct loop instead of forEachLine

module.exports = {
  names: ['material-navigation-structure', 'material-nav-structure'],
  description: 'Material for MkDocs navigation structure best practices',
  tags: ['material-mkdocs', 'navigation', 'headings', 'warning'],
  parser: 'markdownit',
  function: function rule(params, onError) {
    const lines = params.lines;

    const headingRegex = /^(#{1,6})\s+(.+)$/;
    let previousLevel = 0;
    let headingStack = [];
    const maxDepth = 5;
    const maxTitleLength = 100;

    // Track code block state
    let inFencedCodeBlock = false;
    let fencePattern = null;

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex];
      const lineNumber = lineIndex + 1;

      // Check for fenced code blocks (```, ~~~, or indented)
      const fencedCodeRegex = /^(\s{0,3})(```|~~~)(.*)$/;
      const indentedCodeRegex = /^ {4}/;

      const fenceMatch = line.match(fencedCodeRegex);

      if (fenceMatch && !inFencedCodeBlock) {
        // Starting a fenced code block
        inFencedCodeBlock = true;
        fencePattern = fenceMatch[2]; // ``` or ~~~
      } else if (fenceMatch && inFencedCodeBlock && fenceMatch[2] === fencePattern) {
        // Ending a fenced code block
        inFencedCodeBlock = false;
        fencePattern = null;
      }

      // Skip heading detection if we're in a code block
      if (inFencedCodeBlock || indentedCodeRegex.test(line)) {
        continue;
      }

      const headingMatch = line.match(headingRegex);

      if (headingMatch) {
        const headingHashes = headingMatch[1];
        const headingText = headingMatch[2].trim();
        const currentLevel = headingHashes.length;

        // Check heading text length
        if (headingText.length > maxTitleLength) {
          onError({
            lineNumber: lineNumber,
            detail: `Navigation title too long (${headingText.length} chars). Keep under ${maxTitleLength} characters for better UX`,
            context: line
          });
        }

        // Check for empty heading
        if (headingText === '') {
          onError({
            lineNumber: lineNumber,
            detail: 'Heading cannot be empty',
            context: line
          });
          return;
        }

        // Check maximum depth
        if (currentLevel > maxDepth) {
          onError({
            lineNumber: lineNumber,
            detail: `Heading too deep (level ${currentLevel}). Consider restructuring to stay within ${maxDepth} levels for better navigation`,
            context: line
          });
        }

        // Check for skipped heading levels
        if (previousLevel > 0) {
          const levelDifference = currentLevel - previousLevel;

          // Allow going deeper by only 1 level, or going shallower by any amount
          if (levelDifference > 1) {
            onError({
              lineNumber: lineNumber,
              detail: `Skipped heading level. Went from h${previousLevel} to h${currentLevel}. Use h${previousLevel + 1} instead for proper hierarchy`,
              context: line
            });
          }
        }

        // Update heading stack for hierarchy tracking
        // Remove headings that are at the same level or deeper
        while (headingStack.length > 0 && headingStack[headingStack.length - 1].level >= currentLevel) {
          headingStack.pop();
        }

        // Add current heading to stack
        headingStack.push({
          level: currentLevel,
          text: headingText,
          lineNumber: lineNumber
        });

        // Check for duplicate headings at the same level (within the current section)
        const sameLevelHeadings = headingStack.filter(h => h.level === currentLevel);
        const duplicates = sameLevelHeadings.filter(h => h.text.toLowerCase() === headingText.toLowerCase() && h.lineNumber !== lineNumber);

        if (duplicates.length > 0) {
          onError({
            lineNumber: lineNumber,
            detail: `Duplicate heading "${headingText}" found at same level. Consider using unique titles or restructuring`,
            context: line
          });
        }

        // Check for headings that are too similar (might cause navigation confusion)
        const similarHeadings = headingStack.filter(h => 
          h.level === currentLevel && 
          h.lineNumber !== lineNumber &&
          areHeadingsSimilar(h.text, headingText)
        );

        if (similarHeadings.length > 0) {
          onError({
            lineNumber: lineNumber,
            detail: `Heading "${headingText}" is very similar to "${similarHeadings[0].text}". Consider more distinct titles`,
            context: line
          });
        }

        // Check for common navigation anti-patterns
        checkNavigationPatterns(headingText, lineNumber, onError, line);

        previousLevel = currentLevel;
      }
    }
  }
};

// Check if two headings are too similar
function areHeadingsSimilar(heading1, heading2) {
  const clean1 = heading1.toLowerCase().replace(/[^a-z0-9]/g, '');
  const clean2 = heading2.toLowerCase().replace(/[^a-z0-9]/g, '');

  // Check if one is a substring of the other
  if (clean1.includes(clean2) || clean2.includes(clean1)) {
    return true;
  }

  // Check edit distance for very similar strings
  const distance = levenshteinDistance(clean1, clean2);
  const maxLength = Math.max(clean1.length, clean2.length);

  // If more than 80% similar, consider them too similar
  return distance / maxLength < 0.2;
}

// Simple Levenshtein distance calculation
function levenshteinDistance(a, b) {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

// Check for common navigation anti-patterns
function checkNavigationPatterns(headingText, lineNumber, onError, line) {
  const lowerText = headingText.toLowerCase();

  // Check for generic/vague headings
  const vaguePhrases = [
    'introduction', 'overview', 'getting started', 'basics', 'advanced',
    'miscellaneous', 'other', 'additional', 'more', 'extra', 'general'
  ];

  if (vaguePhrases.includes(lowerText)) {
    onError({
      lineNumber: lineNumber,
      detail: `Consider using more specific heading instead of "${headingText}" for better navigation clarity`,
      context: line
    });
  }

  // Check for overly long phrases that could be shortened
  const wordCount = headingText.split(/\s+/).length;
  if (wordCount > 8) {
    onError({
      lineNumber: lineNumber,
      detail: `Heading has ${wordCount} words. Consider shortening for better navigation (aim for 2-6 words)`,
      context: line
    });
  }

  // Check for ALL CAPS headings
  if (headingText === headingText.toUpperCase() && headingText.length > 3) {
    onError({
      lineNumber: lineNumber,
      detail: 'Avoid ALL CAPS headings. Use sentence case for better readability',
      context: line
    });
  }

  // Check for headings with excessive punctuation
  const punctuationCount = (headingText.match(/[!?.:;,]/g) || []).length;
  if (punctuationCount > 2) {
    onError({
      lineNumber: lineNumber,
      detail: 'Avoid excessive punctuation in headings for cleaner navigation',
      context: line
    });
  }
}
