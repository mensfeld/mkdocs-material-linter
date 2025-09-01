// Rule to validate version banner and warning syntax for Material for MkDocs

module.exports = {
  names: ['material-version-banners', 'material-version-validation'],
  description: 'Material for MkDocs version banners and deprecation notices must use proper syntax',
  tags: ['material-mkdocs', 'version', 'banners', 'info'],
  parser: 'markdownit',
  function: function rule(params, onError) {
    const lines = params.lines;

    // Track code block boundaries to skip validation inside them
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

      // Skip validation inside code blocks
      if (inCodeBlock) {
        continue;
      }

      // Validate snippet includes: --8<-- "filename"
      const snippetIncludeRegex = /--8<--\s*"([^"]*)"/g;
      let snippetMatch;

      while ((snippetMatch = snippetIncludeRegex.exec(line)) !== null) {
        const filename = snippetMatch[1];
        const fullMatch = snippetMatch[0];

        // Check if filename is empty
        if (!filename.trim()) {
          onError({
            lineNumber: lineNumber,
            detail: 'Snippet include filename cannot be empty.',
            context: fullMatch
          });
        }

        // Check if filename has proper extension for banner files
        if (filename.includes('banner') || filename.includes('version')) {
          const validExtensions = ['.md', '.txt', '.html'];
          const hasValidExtension = validExtensions.some(ext => filename.toLowerCase().endsWith(ext));
          
          if (!hasValidExtension) {
            onError({
              lineNumber: lineNumber,
              detail: `Version banner files should have .md, .txt, or .html extension. Found: "${filename}".`,
              context: fullMatch
            });
          }
        }

        // Check for common banner filename patterns
        const commonBannerPatterns = [
          'version-banner.md',
          'deprecation-notice.md',
          'version-warning.md',
          'banner.md'
        ];

        if (filename.includes('banner') || filename.includes('version') || filename.includes('deprecation')) {
          // Suggest standard naming if not using common patterns
          const isStandardName = commonBannerPatterns.some(pattern => 
            filename.toLowerCase() === pattern.toLowerCase()
          );

          if (!isStandardName) {
            // This is informational, not an error
            onError({
              lineNumber: lineNumber,
              detail: 'Consider using standard banner filenames like "version-banner.md" or "deprecation-notice.md" for consistency.',
              context: fullMatch
            });
          }
        }
      }

      // Check for malformed snippet includes
      const malformedSnippets = [
        { pattern: /--8<--\s*[^"'][^"'\s]*[^"']/, message: 'Snippet include filenames must be enclosed in double quotes.' },
        { pattern: /--8<--\s*'[^']+'/, message: 'Use double quotes for snippet include filenames, not single quotes.' },
        { pattern: /--8<--\s*$/, message: 'Incomplete snippet include. Add filename in quotes after --8<--.' },
        { pattern: /--8<[^-]/, message: 'Malformed snippet include syntax. Use --8<-- "filename".' },
        { pattern: /(?<!-)-8<--/, message: 'Incomplete snippet include syntax. Use --8<-- (with double dash).' }
      ];

      for (const malformed of malformedSnippets) {
        if (malformed.pattern.test(line)) {
          onError({
            lineNumber: lineNumber,
            detail: malformed.message,
            context: line.trim()
          });
        }
      }

      // Skip version validation on lines with snippet includes
      if (/--8<--/.test(line)) {
        continue;
      }

      // Validate version syntax patterns
      const versionPatterns = [
        // Semantic versioning
        { pattern: /\bv?\d+\.\d+\.\d+(?:-[a-zA-Z0-9\-\.]+)?(?:\+[a-zA-Z0-9\-\.]+)?\b/g, type: 'semver' },
        // Date-based versions
        { pattern: /\b\d{4}-\d{2}-\d{2}\b/g, type: 'date' },
        // Simple versions
        { pattern: /\bv?\d+\.\d+\b/g, type: 'simple' }
      ];

      // Look for version-related keywords that might indicate version information
      const versionKeywords = ['version', 'deprecated', 'added', 'removed', 'changed', 'since'];
      const hasVersionKeyword = versionKeywords.some(keyword => 
        line.toLowerCase().includes(keyword)
      );

      if (hasVersionKeyword) {
        for (const versionPattern of versionPatterns) {
          const matches = line.matchAll(versionPattern.pattern);
          for (const match of matches) {
            const version = match[0];

            // Check for version format consistency
            if (versionPattern.type === 'semver') {
              // Validate semantic versioning format
              const semverRegex = /^v?(\d+)\.(\d+)\.(\d+)(?:-([a-zA-Z0-9\-\.]+))?(?:\+([a-zA-Z0-9\-\.]+))?$/;
              if (!semverRegex.test(version)) {
                onError({
                  lineNumber: lineNumber,
                  detail: 'Invalid semantic version format. Use format like "1.2.3" or "v1.2.3-alpha.1".',
                  context: version
                });
              }
            }

            // Check for version prefix consistency
            if (line.includes(version)) {
              // Look for inconsistent version prefixes in the same line
              const versionMatches = Array.from(line.matchAll(/v?\d+\.\d+(?:\.\d+)?/g));
              if (versionMatches.length > 1) {
                const hasV = versionMatches.some(m => m[0].startsWith('v'));
                const hasNoV = versionMatches.some(m => !m[0].startsWith('v'));
                
                if (hasV && hasNoV) {
                  onError({
                    lineNumber: lineNumber,
                    detail: 'Inconsistent version prefixes. Use either "v1.2.3" or "1.2.3" consistently.',
                    context: line.trim()
                  });
                }
              }
            }
          }
        }
      }

      // Check for deprecation notice patterns
      const deprecationPatterns = [
        /!!! warning "deprecated"/i,
        /!!! danger "deprecated"/i,
        /!!! note "deprecated"/i,
        /::: warning deprecated/i,
        /::: danger deprecated/i
      ];

      for (const pattern of deprecationPatterns) {
        if (pattern.test(line)) {
          // Check if deprecation notice has version information
          const nextFewLines = lines.slice(lineIndex, Math.min(lineIndex + 5, lines.length));
          const hasVersionInfo = nextFewLines.some(nextLine => 
            versionPatterns.some(vp => vp.pattern.test(nextLine))
          );

          if (!hasVersionInfo) {
            onError({
              lineNumber: lineNumber,
              detail: 'Deprecation notices should include version information (when deprecated, when removed).',
              context: line.trim()
            });
          }
          break;
        }
      }

      // Check for version banner structure in admonitions
      if (/^!!!\s+(?:warning|danger|info|note)/i.test(trimmedLine)) {
        const admonitionType = trimmedLine.match(/^!!!\s+(\w+)/i)[1].toLowerCase();
        
        if (trimmedLine.toLowerCase().includes('version') || 
            trimmedLine.toLowerCase().includes('deprecated') ||
            trimmedLine.toLowerCase().includes('added') ||
            trimmedLine.toLowerCase().includes('removed')) {
          
          // Check for proper admonition type for version information
          const appropriateTypes = {
            'deprecated': ['warning', 'danger'],
            'removed': ['danger', 'error'],
            'added': ['info', 'note', 'tip'],
            'changed': ['info', 'note'],
            'version': ['info', 'note']
          };

          const contentLower = trimmedLine.toLowerCase();
          for (const [keyword, types] of Object.entries(appropriateTypes)) {
            if (contentLower.includes(keyword) && !types.includes(admonitionType)) {
              onError({
                lineNumber: lineNumber,
                detail: `Consider using admonition type "${types[0]}" for ${keyword} notices instead of "${admonitionType}".`,
                context: trimmedLine
              });
            }
          }
        }
      }
    }
  }
};