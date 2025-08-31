// Rule to validate Material for MkDocs icon references

module.exports = {
  names: ['material-icons-valid', 'material-valid-icons'],
  description: 'Material for MkDocs icon references must use valid icon names from supported icon sets',
  tags: ['material-mkdocs', 'icons', 'warning'],
  parser: 'markdownit',
  function: function rule(params, onError) {
    const lines = params.lines;

    // Common Material Design Icons (subset)
    const materialIcons = [
      'account', 'account-circle', 'add', 'add-circle', 'arrow-back', 'arrow-forward',
      'check', 'check-circle', 'close', 'delete', 'edit', 'favorite', 'help',
      'home', 'info', 'menu', 'more-vert', 'notifications', 'person', 'search',
      'settings', 'share', 'star', 'warning', 'bookmark', 'calendar-today',
      'download', 'email', 'file-copy', 'folder', 'label', 'lock', 'open-in-new',
      'print', 'refresh', 'save', 'schedule', 'visibility', 'work'
    ];

    // Common FontAwesome icons (subset)
    const fontAwesomeIcons = [
      'home', 'user', 'cog', 'heart', 'star', 'search', 'envelope', 'phone',
      'calendar', 'clock', 'edit', 'trash', 'download', 'upload', 'link',
      'share', 'print', 'save', 'copy', 'cut', 'paste', 'file', 'folder',
      'image', 'video', 'music', 'book', 'question-circle', 'info-circle',
      'exclamation-triangle', 'check-circle', 'times-circle', 'arrow-left',
      'arrow-right', 'arrow-up', 'arrow-down', 'plus', 'minus', 'github',
      'twitter', 'facebook', 'linkedin', 'instagram'
    ];

    // Octicons (subset)
    const octiconIcons = [
      'alert', 'archive', 'arrow-down', 'arrow-left', 'arrow-right', 'arrow-up',
      'beaker', 'bell', 'bold', 'book', 'bookmark', 'briefcase', 'broadcast',
      'bug', 'calendar', 'check', 'chevron-down', 'chevron-left', 'chevron-right',
      'chevron-up', 'circle-slash', 'clippy', 'clock', 'cloud-download',
      'cloud-upload', 'code', 'comment', 'comment-discussion', 'credit-card',
      'dash', 'database', 'desktop-download', 'device-camera', 'device-camera-video',
      'device-desktop', 'device-mobile', 'diff', 'diff-added', 'diff-ignored',
      'diff-modified', 'diff-removed', 'diff-renamed', 'ellipsis', 'eye',
      'file-binary', 'file-code', 'file-directory', 'file-media', 'file-pdf',
      'file-text', 'file-zip', 'flame', 'fold', 'gear', 'gift', 'gist',
      'gist-secret', 'git-branch', 'git-commit', 'git-compare', 'git-merge',
      'git-pull-request', 'globe', 'graph', 'heart', 'history', 'home',
      'horizontal-rule', 'hubot', 'inbox', 'info', 'issue-closed', 'issue-opened',
      'issue-reopened', 'italic', 'jersey', 'key', 'keyboard', 'law', 'light-bulb',
      'link', 'link-external', 'list-ordered', 'list-unordered', 'location',
      'lock', 'logo-gist', 'logo-github', 'mail', 'mail-read', 'mail-reply',
      'mark-github', 'markdown', 'megaphone', 'mention', 'milestone', 'mirror',
      'mortar-board', 'mute', 'no-newline', 'octoface', 'organization', 'package',
      'paintcan', 'pencil', 'person', 'pin', 'plug', 'plus', 'primitive-dot',
      'primitive-square', 'pulse', 'question', 'quote', 'radio-tower', 'reply',
      'repo', 'repo-clone', 'repo-force-push', 'repo-forked', 'repo-pull',
      'repo-push', 'rocket', 'rss', 'ruby', 'search', 'server', 'settings',
      'shield', 'sign-in', 'sign-out', 'smiley', 'squirrel', 'star', 'stop',
      'sync', 'tag', 'tasklist', 'telescope', 'terminal', 'text-size',
      'three-bars', 'thumbsdown', 'thumbsup', 'tools', 'trashcan', 'triangle-down',
      'triangle-left', 'triangle-right', 'triangle-up', 'unfold', 'unmute',
      'unverified', 'verified', 'versions', 'watch', 'x', 'zap'
    ];

    // Icon patterns to match
    const iconPatterns = [
      { pattern: /:material-([a-zA-Z0-9\-_]+):/, set: 'material', icons: materialIcons },
      { pattern: /:fontawesome-(?:solid|regular|brands)-([a-zA-Z0-9\-_]+):/, set: 'fontawesome', icons: fontAwesomeIcons },
      { pattern: /:octicons-([a-zA-Z0-9\-_]+):/, set: 'octicons', icons: octiconIcons },
      { pattern: /:simple-([a-zA-Z0-9\-_]+):/, set: 'simple-icons', icons: [] } // Simple icons validation would need full list
    ];

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex];
      const lineNumber = lineIndex + 1;

      for (const iconConfig of iconPatterns) {
        let match;
        const regex = new RegExp(iconConfig.pattern.source, 'g');

        while ((match = regex.exec(line)) !== null) {
          const iconName = match[1];
          const fullMatch = match[0];

          // Skip validation for simple-icons as they have too many to maintain
          if (iconConfig.set === 'simple-icons') {
            continue;
          }

          // Check if icon exists in the known set
          if (!iconConfig.icons.includes(iconName)) {
            onError({
              lineNumber: lineNumber,
              detail: `Unknown ${iconConfig.set} icon "${iconName}". Verify the icon name exists in the ${iconConfig.set} icon set.`,
              context: fullMatch
            });
          }
        }
      }
    }
  }
};