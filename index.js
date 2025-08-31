// Main export - array of all Material for MkDocs custom rules
module.exports = [
  require('./lib/rules/admonition-types'),
  require('./lib/rules/admonition-indentation'),
  require('./lib/rules/admonition-empty'),
  require('./lib/rules/code-annotations'),
  require('./lib/rules/content-tabs'),
  require('./lib/rules/navigation-structure')
];