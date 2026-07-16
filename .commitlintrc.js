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

/** Area scopes allowed for any commit type (including feat/fix). */
const AREA_SCOPES = ['deps', 'ci', 'readme', 'docs', 'versions', 'release'];

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
          const { type, scope, header } = parsed;

          // Detect breaking change marker in raw header as fallback
          const isBreaking = !!(header && header.includes('!:'));
          const isVersioningType = ['feat', 'fix'].includes(type);

          // Non-versioning, non-breaking commits can use any scope
          if (!isBreaking && !isVersioningType) {
            return [true];
          }

          // No scope is fine — Nx uses file changes to determine affected packages
          if (!scope) {
            return [true];
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
            if (AREA_SCOPES.includes(trimmed)) continue;
            if (!validProjects.has(trimmed)) {
              const commitType = isBreaking ? 'breaking (!)/feat/fix' : 'feat/fix';
              return [
                false,
                `Scope "${trimmed}" must be a full Nx project name for ${commitType} commits.\n` +
                  `Use: ${type}(@redhat-cloud-services/<package>)${isBreaking ? '!' : ''}: ...\n` +
                  `Not: ${type}(${trimmed})${isBreaking ? '!' : ''}: ...`,
              ];
            }
          }

          return [true];
        },
      },
    },
  ],
};
