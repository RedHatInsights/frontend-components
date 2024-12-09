module.exports ={
    extends: ['@commitlint/config-conventional'],
    // Ignore rules can be found here
    // https://github.com/conventional-changelog/commitlint/blob/master/%40commitlint/is-ignored/src/defaults.ts
    defaultIgnores: true,
    'body-max-length': Infinity,
    'body-max-line-length': Infinity,
}
