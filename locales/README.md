# Locale deliveries

Phrase writes translated library messages here as `<locale>.json` (for example `fr.json`, `zh-CN.json`). The translations package loads the file matching the user's locale on demand; a locale without a file renders English.

There is no English catalog: English comes from each message's `defaultMessage` in source.

Keep this file. Bundlers resolve the package's `locales/` directory at build time and fail if it is missing, and npm does not publish empty directories.
