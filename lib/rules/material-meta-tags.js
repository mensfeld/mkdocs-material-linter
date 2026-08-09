// Rule to validate YAML front matter metadata for Material for MkDocs features

module.exports = {
  names: ['material-meta-tags', 'material-metadata'],
  description: 'Material for MkDocs pages should include proper metadata for SEO and social features',
  tags: ['material-mkdocs', 'metadata', 'seo', 'warning'],
  parser: 'markdownit',
  function: function rule(params, onError) {
    const lines = params.lines;

    // markdownlint extracts YAML front matter into params.frontMatterLines and
    // removes it from params.lines, so we must inspect frontMatterLines here.
    // It contains the leading/trailing "---" delimiters (and a trailing blank).
    const rawFrontMatter = params.frontMatterLines || [];

    if (rawFrontMatter.length === 0) {
      // No front matter was extracted. If the document still opens with "---",
      // it's an unclosed block; otherwise there's no front matter at all.
      if ((lines[0] || '').trim() === '---') {
        onError({
          lineNumber: 1,
          detail: 'YAML front matter is not properly closed with "---".',
          context: '---'
        });
      } else {
        onError({
          lineNumber: 1,
          detail: 'Missing YAML front matter. Add metadata like description, tags, and template for better Material for MkDocs integration.',
          context: lines[0] || ''
        });
      }
      return;
    }

    // Collect the content lines between the opening and closing "---" delimiters.
    const frontMatterLines = [];
    for (let i = 1; i < rawFrontMatter.length; i++) {
      if (rawFrontMatter[i].trim() === '---') {
        break;
      }
      frontMatterLines.push(rawFrontMatter[i]);
    }

    // Parse front matter content
    const metadata = {};

    for (let i = 0; i < frontMatterLines.length; i++) {
      const line = frontMatterLines[i];
      const match = line.match(/^(\w+):\s*(.*)$/);

      if (match) {
        const key = match[1].toLowerCase();
        const value = match[2].trim();
        metadata[key] = value;
      }
    }

    // Check for recommended metadata fields
    const recommendations = [
      {
        key: 'description',
        message: 'Add a "description" field for better SEO and search results.',
        required: false
      },
      {
        key: 'title',
        message: 'Consider adding a "title" field to override the default page title.',
        required: false
      }
    ];

    // Front matter is stripped from params.lines by markdownlint, so its lines
    // are not addressable by onError (only body line numbers are valid). Report
    // all metadata findings at line 1, the closest we can point to the top.
    const frontMatterLine = 1;

    // Check for missing recommended fields
    for (const rec of recommendations) {
      if (!metadata[rec.key] || metadata[rec.key] === '') {
        onError({
          lineNumber: frontMatterLine,
          detail: rec.message,
          context: '---'
        });
      }
    }

    // Validate description length
    if (metadata.description && metadata.description.length > 160) {
      onError({
        lineNumber: frontMatterLine,
        detail: 'Description should be under 160 characters for optimal SEO.',
        context: `description: ${metadata.description}`
      });
    }

    // Check for template field validation
    if (metadata.template) {
      const validTemplates = ['main.html', 'blog.html', 'landing.html'];
      if (!validTemplates.includes(metadata.template) && !metadata.template.endsWith('.html')) {
        onError({
          lineNumber: frontMatterLine,
          detail: 'Template should be a valid HTML template file (e.g., main.html).',
          context: `template: ${metadata.template}`
        });
      }
    }

    // Check for tags format
    if (metadata.tags) {
      // Tags should be a YAML list or comma-separated
      const tagLine = frontMatterLines.find(line => line.toLowerCase().includes('tags:'));
      if (tagLine && !tagLine.includes('[') && !tagLine.includes('-')) {
        onError({
          lineNumber: frontMatterLine,
          detail: 'Tags should be formatted as a YAML list (e.g., tags: [tag1, tag2] or use bullet points).',
          context: tagLine
        });
      }
    }

    // Check for hide navigation/toc settings
    if (metadata.hide) {
      const hideOptions = ['navigation', 'toc'];
      const hideValues = metadata.hide.split(/[\s,]+/).map(v => v.trim());

      for (const value of hideValues) {
        if (!hideOptions.includes(value)) {
          onError({
            lineNumber: frontMatterLine,
            detail: `Invalid hide option "${value}". Valid options are: navigation, toc.`,
            context: `hide: ${metadata.hide}`
          });
        }
      }
    }
  }
};