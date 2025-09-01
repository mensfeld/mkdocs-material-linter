// Not using markdownlint-rule-helpers anymore

// Map of language to their comment styles
const languageCommentStyles = {
  // Hash-style comments
  'python': '#',
  'py': '#',
  'ruby': '#',
  'rb': '#',
  'perl': '#',
  'pl': '#',
  'bash': '#',
  'sh': '#',
  'shell': '#',
  'yaml': '#',
  'yml': '#',
  'toml': '#',
  'ini': '#',
  'dockerfile': '#',
  'makefile': '#',
  'cmake': '#',
  'r': '#',

  // Double-slash comments
  'javascript': '//',
  'js': '//',
  'typescript': '//',
  'ts': '//',
  'jsx': '//',
  'tsx': '//',
  'java': '//',
  'c': '//',
  'cpp': '//',
  'c++': '//',
  'csharp': '//',
  'cs': '//',
  'go': '//',
  'rust': '//',
  'rs': '//',
  'swift': '//',
  'kotlin': '//',
  'kt': '//',
  'scala': '//',
  'php': '//',
  'dart': '//',
  'groovy': '//',

  // HTML/XML style comments
  'html': '<!--',
  'xml': '<!--',
  'svg': '<!--',
  'markdown': '<!--',
  'md': '<!--',

  // SQL style comments
  'sql': '--',
  'postgresql': '--',
  'mysql': '--',
  'sqlite': '--',

  // Other comment styles
  'lua': '--',
  'haskell': '--',
  'hs': '--',
  'elm': '--',
  'ada': '--',
  'vb': '\'',
  'vbnet': '\'',
  'fortran': '!',
  'f90': '!',
  'matlab': '%',
  'octave': '%',
  'latex': '%',
  'tex': '%'
};

// Get the appropriate comment style for a language
function getCommentStyle(language) {
  if (!language) return null;
  return languageCommentStyles[language.toLowerCase()] || null;
}

// Check if a line contains a code annotation
function hasAnnotation(line) {
  // Match annotations like (1), (1)!, (1)?, etc.
  return /\(\d+\)[!?]?(?:\s|$)/.test(line);
}

// Extract the annotation pattern from a line
function getAnnotationPattern(line) {
  const match = line.match(/(\(\d+\)[!?]?)(?:\s|$)/);
  return match ? match[1] : null;
}

module.exports = {
  names: ['material-code-annotations', 'material-annotation-comments'],
  description: 'Material for MkDocs code annotations must use correct comment style for language',
  tags: ['material-mkdocs', 'code', 'annotations', 'warning'],
  parser: 'markdownit',
  function: function rule(params, onError) {
    const lines = params.lines;
    let inCodeBlock = false;
    let codeBlockLanguage = null;
    // codeBlockStartLine is not needed in current implementation

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex];
      const lineNumber = lineIndex + 1;

      // Check if this line starts or ends a code block
      if (line.startsWith('```')) {
        if (!inCodeBlock) {
          // Starting a code block
          inCodeBlock = true;
          // Extract language from the opening fence
          codeBlockLanguage = line.substring(3).trim().split(/\s+/)[0] || null;
        } else {
          // Ending a code block
          inCodeBlock = false;
          codeBlockLanguage = null;
        }
        return;
      }

      // If we're inside a code block and the line has an annotation
      if (inCodeBlock && hasAnnotation(line)) {
        const expectedCommentStyle = getCommentStyle(codeBlockLanguage);

        // Skip if we don't know the comment style for this language
        if (!expectedCommentStyle) {
          return;
        }

        const annotation = getAnnotationPattern(line);
        if (!annotation) return;

        // Check different comment patterns
        let hasCorrectStyle = false;
        let foundStyle = null;

        // For HTML/XML style
        if (expectedCommentStyle === '<!--') {
          const htmlPattern = new RegExp(`<!--\\s*${annotation.replace(/[()!?]/g, '\\$&')}\\s*-->`);
          hasCorrectStyle = htmlPattern.test(line);
          if (!hasCorrectStyle) {
            // Check what style was actually used
            if (line.includes(`# ${annotation}`)) foundStyle = '#';
            else if (line.includes(`// ${annotation}`)) foundStyle = '//';
            else if (line.includes(`-- ${annotation}`)) foundStyle = '--';
          }
        }
        // For other comment styles
        else {
          const pattern = new RegExp(`${expectedCommentStyle}\\s*${annotation.replace(/[()!?]/g, '\\$&')}`);
          hasCorrectStyle = pattern.test(line);

          if (!hasCorrectStyle) {
            // Check what style was actually used
            if (line.includes(`# ${annotation}`)) foundStyle = '#';
            else if (line.includes(`// ${annotation}`)) foundStyle = '//';
            else if (line.includes(`<!-- ${annotation}`)) foundStyle = '<!--';
            else if (line.includes(`-- ${annotation}`)) foundStyle = '--';
            else if (line.includes(`' ${annotation}`)) foundStyle = '\'';
            else if (line.includes(`! ${annotation}`)) foundStyle = '!';
            else if (line.includes(`% ${annotation}`)) foundStyle = '%';
          }
        }

        // Report error if comment style doesn't match
        if (!hasCorrectStyle && foundStyle) {
          let detail = `Code annotation should use ${codeBlockLanguage} comment style`;
          let expectedExample = '';

          if (expectedCommentStyle === '<!--') {
            expectedExample = `<!-- ${annotation} -->`;
          } else {
            expectedExample = `${expectedCommentStyle} ${annotation}`;
          }

          detail += `. Expected "${expectedExample}" format`;

          if (foundStyle) {
            detail += `, found "${foundStyle}" style`;
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
