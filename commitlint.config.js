const { execSync } = require('child_process');

function getNxProjects() {
  try {
    const output = execSync('npx nx show projects --json', {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    return JSON.parse(output);
  } catch {
    return [];
  }
}

const validProjects = new Set(getNxProjects());

module.exports = {
  extends: ['@commitlint/config-conventional'],
  defaultIgnores: true,
  rules: {
    'scope-case': [0],
    'body-max-length': [0],
    'body-max-line-length': [0],
    'scope-full-name-for-versioning': [2, 'always'],
  },
  plugins: [
    {
      rules: {
        'scope-full-name-for-versioning': (parsed) => {
          const { type, scope, header, notes } = parsed;

          // Detect breaking change: header `!:` marker OR BREAKING CHANGE footer
          const isBreaking =
            !!(header && header.includes('!:')) ||
            !!(notes && notes.some((n) => n.title === 'BREAKING CHANGE'));
          const isVersioningType = type === 'feat';

          // Non-versioning, non-breaking commits can use any scope
          if (!isBreaking && !isVersioningType) {
            return [true];
          }

          // Scope required for feat and breaking commits
          if (!scope) {
            const commitType = isBreaking ? 'breaking (!)/feat' : 'feat';
            return [
              false,
              `Scope required for ${commitType} commits.\n` +
                `Use: ${type}(@redhat-cloud-services/utilities): ...`
            ];
          }

          // Extract scope from raw header as fallback when parser strips it
          // (e.g. @commitlint/lint default parser may not handle `!` marker)
          let resolvedScope = scope;
          if (!resolvedScope && header) {
            const match = header.match(/^\w+\(([^)]+)\)/);
            if (match) {
              resolvedScope = match[1];
            }
          }

          if (!resolvedScope) {
            return [true];
          }

          const scopes = resolvedScope.split(',');
          for (const s of scopes) {
            const trimmed = s.trim();
            if (!validProjects.has(trimmed)) {
              const commitType = isBreaking ? 'breaking (!)/feat' : 'feat';
              const hint = trimmed.startsWith('@redhat-cloud-services/')
                ? `Project "${trimmed}" not found. Run: npx nx show projects`
                : `Use full project name like: ${type}(@redhat-cloud-services/utilities)${isBreaking ? '!' : ''}: ...`;
              return [
                false,
                `Scope "${trimmed}" must be a full Nx project name for ${commitType} commits.\n${hint}`,
              ];
            }
          }

          return [true];
        },
      },
    },
  ],
};
