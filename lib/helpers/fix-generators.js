/**
 * Helper functions for generating auto-fix information for Material for MkDocs rules
 */

/**
 * Generate fix for invalid admonition type
 * @param {string} line - Original line
 * @param {string} invalidType - Invalid admonition type
 * @param {string} suggestedType - Suggested valid type
 * @returns {Object} Fix information
 */
function generateAdmonitionTypeFix(line, invalidType, suggestedType) {
  const match = line.match(/^(!!!?\s+)(\S+)(.*)$/);
  if (!match) return null;
  
  const prefix = match[1];
  // const suffix = match[3]; // Not used in current implementation
  
  return {
    editColumn: prefix.length + 1,
    deleteCount: invalidType.length,
    insertText: suggestedType
  };
}

/**
 * Generate fix for incorrect admonition indentation
 * @param {string} line - Original line
 * @param {number} correctSpaces - Number of spaces that should be used
 * @returns {Object} Fix information
 */
function generateIndentationFix(line, correctSpaces) {
  const content = line.trimStart();
  const newIndentation = ' '.repeat(correctSpaces);
  
  return {
    editColumn: 1,
    deleteCount: line.length,
    insertText: newIndentation + content
  };
}

/**
 * Generate fix for content tab delimiter
 * @param {string} line - Original line
 * @param {string} title - Tab title
 * @returns {Object} Fix information
 */
function generateTabDelimiterFix(line, title) {
  return {
    editColumn: 1,
    deleteCount: line.length,
    insertText: `=== "${title}"`
  };
}

/**
 * Generate fix for content tab title (add quotes)
 * @param {string} line - Original line
 * @param {string} title - Unquoted title
 * @returns {Object} Fix information
 */
function generateTabTitleFix(line, title) {
  const match = line.match(/^(=+\s*)(.*?)(\s*)$/);
  if (!match) return null;
  
  const prefix = match[1];
  // const suffix = match[3]; // Not used in current implementation
  
  return {
    editColumn: prefix.length + 1,
    deleteCount: title.length,
    insertText: `"${title.trim()}"`
  };
}

/**
 * Generate fix for shell code block language
 * @param {string} line - Original code fence line
 * @returns {Object} Fix information
 */
function generateShellLanguageFix(line) {
  return {
    editColumn: 1,
    deleteCount: line.length,
    insertText: '```shell'
  };
}

/**
 * Generate fix for code annotation comment style
 * @param {string} line - Original line
 * @param {string} annotation - Annotation pattern like "(1)!"
 * @param {string} wrongStyle - Wrong comment style used
 * @param {string} correctStyle - Correct comment style for language
 * @returns {Object} Fix information
 */
function generateAnnotationCommentFix(line, annotation, wrongStyle, correctStyle) {
  let correctedLine = line;
  
  // Handle different comment styles
  if (correctStyle === '<!--') {
    // HTML/XML style
    const correctAnnotation = `<!-- ${annotation} -->`;
    correctedLine = line.replace(`${wrongStyle} ${annotation}`, correctAnnotation);
  } else {
    // Simple replacement
    correctedLine = line.replace(`${wrongStyle} ${annotation}`, `${correctStyle} ${annotation}`);
  }
  
  return {
    editColumn: 1,
    deleteCount: line.length,
    insertText: correctedLine
  };
}

/**
 * Generate fix for empty admonition title
 * @param {string} line - Original line with empty title
 * @returns {Object} Fix information
 */
function generateEmptyTitleFix(line) {
  // Remove empty quotes from admonition line
  const fixed = line.replace(/\s+""$/, '').replace(/\s+""(\s)/, '$1');
  
  return {
    editColumn: 1,
    deleteCount: line.length,
    insertText: fixed
  };
}

/**
 * Generate fix for heading case (ALL CAPS to sentence case)
 * @param {string} line - Original heading line
 * @param {string} headingText - The heading text part
 * @returns {Object} Fix information
 */
function generateHeadingCaseFix(line, headingText) {
  const match = line.match(/^(#+\s+)(.+)$/);
  if (!match) return null;
  
  const prefix = match[1];
  
  // Convert to sentence case
  const sentenceCase = headingText.charAt(0).toUpperCase() + 
                      headingText.slice(1).toLowerCase();
  
  return {
    editColumn: prefix.length + 1,
    deleteCount: headingText.length,
    insertText: sentenceCase
  };
}

/**
 * Generate fix for excessive punctuation in headings
 * @param {string} line - Original heading line
 * @param {string} headingText - The heading text part
 * @returns {Object} Fix information
 */
function generatePunctuationFix(line, headingText) {
  const match = line.match(/^(#+\s+)(.+)$/);
  if (!match) return null;
  
  const prefix = match[1];
  
  // Remove excessive punctuation (keep only one at the end if needed)
  const cleaned = headingText
    .replace(/[!?.:;,]+/g, '') // Remove all punctuation
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
  
  return {
    editColumn: prefix.length + 1,
    deleteCount: headingText.length,
    insertText: cleaned
  };
}

/**
 * Generate fix for tab content indentation
 * @param {string} line - Original line
 * @param {number} targetIndentation - Target indentation level (multiple of 4)
 * @returns {Object} Fix information
 */
function generateTabContentIndentationFix(line, targetIndentation) {
  const content = line.trimStart();
  const newIndentation = ' '.repeat(targetIndentation);
  
  return {
    editColumn: 1,
    deleteCount: line.length,
    insertText: newIndentation + content
  };
}

/**
 * Create a complete fix info object
 * @param {number} lineNumber - Line number (1-based)
 * @param {Object} editInfo - Edit information from individual fix generators
 * @returns {Object} Complete fix info object
 */
function createFixInfo(lineNumber, editInfo) {
  return {
    lineNumber: lineNumber,
    ...editInfo
  };
}

module.exports = {
  generateAdmonitionTypeFix,
  generateIndentationFix,
  generateTabDelimiterFix,
  generateTabTitleFix,
  generateShellLanguageFix,
  generateAnnotationCommentFix,
  generateEmptyTitleFix,
  generateHeadingCaseFix,
  generatePunctuationFix,
  generateTabContentIndentationFix,
  createFixInfo
};