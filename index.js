// Main export - array of all Material for MkDocs custom rules
module.exports = [
  require('./lib/rules/admonition-types'),
  require('./lib/rules/admonition-indentation'),
  require('./lib/rules/admonition-empty'),
  require('./lib/rules/admonition-empty-title'),
  require('./lib/rules/code-annotations'),
  require('./lib/rules/content-tabs'),
  require('./lib/rules/navigation-structure'),
  require('./lib/rules/shell-language-standardization'),
  require('./lib/rules/bundle-exec-shell-type'),
  require('./lib/rules/material-icons-valid'),
  require('./lib/rules/material-meta-tags'),
  require('./lib/rules/material-mermaid-syntax'),
  require('./lib/rules/material-footnotes-syntax'),
  require('./lib/rules/blank-lines-spacing'),
  require('./lib/rules/code-block-syntax'),
  require('./lib/rules/list-auto-numbering')
];