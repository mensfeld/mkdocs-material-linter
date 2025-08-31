/**
 * Helper functions for parsing Material for MkDocs specific syntax
 */

/**
 * Check if a token represents an admonition block
 * @param {Object} token - Markdown token
 * @returns {boolean} True if token is an admonition
 */
function isAdmonitionToken(token) {
  if (token.type !== 'paragraph_open') return false;

  const nextToken = token.next;
  if (!nextToken || nextToken.type !== 'inline') return false;

  const content = nextToken.content;
  return /^!!!?\s+\S+/.test(content);
}

/**
 * Extract admonition type from a line
 * @param {string} line - Line of markdown text
 * @returns {string|null} Admonition type or null if not an admonition
 */
function getAdmonitionType(line) {
  const match = line.match(/^!!!?\s+(\S+)/);
  return match ? match[1] : null;
}

/**
 * Validate indentation for admonition content
 * @param {string[]} lines - Array of markdown lines
 * @param {number} startLine - Starting line index (0-based)
 * @param {number} endLine - Ending line index (0-based)
 * @returns {Array} Array of indentation issues
 */
function validateIndentation(lines, startLine, endLine) {
  const issues = [];

  for (let i = startLine; i <= endLine; i++) {
    const line = lines[i];
    if (!line || line.trim() === '') continue;

    const leadingSpaces = line.match(/^( *)/)[1];
    const spacesCount = leadingSpaces.length;

    // Check for tabs
    if (line.startsWith('\t') || line.match(/^[ ]*\t/)) {
      issues.push({
        lineIndex: i,
        type: 'tabs',
        message: 'Use spaces instead of tabs',
        expected: '    ' + line.replace(/^\s+/, '')
      });
      continue;
    }

    // Check for proper 4-space indentation
    if (spacesCount > 0 && spacesCount % 4 !== 0) {
      const correctSpaces = Math.ceil(spacesCount / 4) * 4;
      issues.push({
        lineIndex: i,
        type: 'indentation',
        message: `Expected ${correctSpaces} spaces, found ${spacesCount}`,
        expected: ' '.repeat(correctSpaces) + line.trimStart()
      });
    }
  }

  return issues;
}

/**
 * Extract language from a code block token
 * @param {Object} token - Code block token
 * @returns {string|null} Language identifier or null
 */
function getCodeBlockLanguage(token) {
  if (token.type !== 'code_block' && token.type !== 'fence') return null;

  // For fenced code blocks
  if (token.info) {
    return token.info.trim().split(/\s+/)[0] || null;
  }

  // For indented code blocks, we can't determine language
  return null;
}

/**
 * Check if a token represents a content tab block
 * @param {Object} token - Markdown token
 * @returns {boolean} True if token is a content tab
 */
function isContentTabBlock(token) {
  if (token.type !== 'paragraph_open') return false;

  const nextToken = token.next;
  if (!nextToken || nextToken.type !== 'inline') return false;

  const content = nextToken.content;
  return /^===\s*"[^"]+"\s*$/.test(content);
}

/**
 * Parse a content tab line
 * @param {string} line - Line containing tab definition
 * @returns {Object|null} Tab info or null if not a valid tab
 */
function parseContentTab(line) {
  const match = line.match(/^(=+)\s*"([^"]+)"\s*$/);
  if (!match) return null;

  return {
    delimiters: match[1],
    title: match[2],
    valid: match[1].length === 3
  };
}

/**
 * Check if a line contains a code annotation
 * @param {string} line - Line of code
 * @returns {boolean} True if line has annotation
 */
function hasCodeAnnotation(line) {
  return /\(\d+\)[!?]?(?:\s|$)/.test(line);
}

/**
 * Extract annotation pattern from a line
 * @param {string} line - Line of code
 * @returns {string|null} Annotation pattern or null
 */
function getAnnotationPattern(line) {
  const match = line.match(/(\(\d+\)[!?]?)(?:\s|$)/);
  return match ? match[1] : null;
}

/**
 * Get comment style for a programming language
 * @param {string} language - Programming language identifier
 * @returns {string|null} Comment style or null if unknown
 */
function getCommentStyle(language) {
  if (!language) return null;

  const commentStyles = {
    // Hash-style comments
    'python': '#', 'py': '#', 'ruby': '#', 'rb': '#', 'perl': '#', 'pl': '#',
    'bash': '#', 'sh': '#', 'shell': '#', 'yaml': '#', 'yml': '#', 'toml': '#',
    'ini': '#', 'dockerfile': '#', 'makefile': '#', 'cmake': '#', 'r': '#',

    // Double-slash comments
    'javascript': '//', 'js': '//', 'typescript': '//', 'ts': '//', 'jsx': '//', 'tsx': '//',
    'java': '//', 'c': '//', 'cpp': '//', 'c++': '//', 'csharp': '//', 'cs': '//',
    'go': '//', 'rust': '//', 'rs': '//', 'swift': '//', 'kotlin': '//', 'kt': '//',
    'scala': '//', 'php': '//', 'dart': '//', 'groovy': '//',

    // HTML/XML style comments
    'html': '<!--', 'xml': '<!--', 'svg': '<!--', 'markdown': '<!--', 'md': '<!--',

    // SQL style comments
    'sql': '--', 'postgresql': '--', 'mysql': '--', 'sqlite': '--',

    // Other comment styles
    'lua': '--', 'haskell': '--', 'hs': '--', 'elm': '--', 'ada': '--',
    'vb': '\'', 'vbnet': '\'', 'fortran': '!', 'f90': '!',
    'matlab': '%', 'octave': '%', 'latex': '%', 'tex': '%'
  };

  return commentStyles[language.toLowerCase()] || null;
}

/**
 * Check if a heading follows proper hierarchy
 * @param {number} currentLevel - Current heading level (1-6)
 * @param {number} previousLevel - Previous heading level (1-6)
 * @returns {boolean} True if hierarchy is valid
 */
function isValidHeadingHierarchy(currentLevel, previousLevel) {
  if (previousLevel === 0) return true; // First heading

  // Can go deeper by 1 level, or shallower by any amount
  return currentLevel <= previousLevel + 1;
}

/**
 * Calculate Levenshtein distance between two strings
 * @param {string} a - First string
 * @param {string} b - Second string
 * @returns {number} Edit distance
 */
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

module.exports = {
  isAdmonitionToken,
  getAdmonitionType,
  validateIndentation,
  getCodeBlockLanguage,
  isContentTabBlock,
  parseContentTab,
  hasCodeAnnotation,
  getAnnotationPattern,
  getCommentStyle,
  isValidHeadingHierarchy,
  levenshteinDistance
};
