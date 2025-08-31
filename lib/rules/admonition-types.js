// Not using markdownlint-rule-helpers anymore

// Calculate Levenshtein distance for auto-fix suggestions
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

// Find the closest valid type for suggestions
function findClosestType(invalidType, validTypes) {
  let closestType = validTypes[0];
  let minDistance = levenshteinDistance(invalidType.toLowerCase(), closestType);

  for (const type of validTypes) {
    const distance = levenshteinDistance(invalidType.toLowerCase(), type);
    if (distance < minDistance) {
      minDistance = distance;
      closestType = type;
    }
  }

  // Only suggest if the distance is reasonable (max 3 character difference)
  return minDistance <= 3 ? closestType : null;
}

module.exports = {
  names: ['material-admonition-types', 'material-valid-admonition-types'],
  description: 'Material for MkDocs admonitions must use only supported types',
  tags: ['material-mkdocs', 'admonitions', 'error'],
  parser: 'markdownit',
  function: function rule(params, onError) {
    // Valid admonition types from Material for MkDocs documentation
    const validTypes = [
      'note',
      'abstract',
      'info',
      'tip',
      'success',
      'question',
      'warning',
      'failure',
      'danger',
      'bug',
      'example',
      'quote'
    ];

    const lines = params.lines;
    const admonitionRegex = /^(\?\?\?\+?\s+|!!!\s+)(\S+)(\s|$)/;

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex];
      const match = line.match(admonitionRegex);

      if (match) {
        const type = match[2];

        // Check if the type is valid (case-sensitive)
        if (!validTypes.includes(type)) {
          const lineNumber = lineIndex + 1;
          const suggestedType = findClosestType(type, validTypes);

          let detail = `Invalid admonition type: "${type}". Valid types are: ${validTypes.join(', ')}`;

          if (suggestedType) {
            detail += `. Did you mean "${suggestedType}"?`;
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
