# Documentation Rules for AI Agents: CLI Tools and Configuration

These rules are for AI agents tasked with generating or updating documentation for CLI tools and configuration files (such as `fec.config.js`) in this repository. Follow these steps to ensure documentation is accurate, up-to-date, and user-friendly.

---

## 1. Locate and Read the Source
- Identify the main entry point for the CLI tool (e.g., `bin/cli.ts`).
- Read the implementation to extract all available commands, options, and their descriptions.
- Locate the configuration file type definitions (e.g., `config.ts`, `*.d.ts`, or interfaces) and read all option types and defaults.

## 2. Document CLI Commands and Options
- List all available CLI commands with a short description for each.
- For each command, document all options (flags, arguments, environment variables), including their types and default values.
- Provide usage examples for common workflows.
- If the CLI is available via `npx` or as a package script, show both usage patterns.

## 3. Document Configuration Options
- List all configuration options, their types, and default values.
- For each option:
  - If it is a primitive (string, number, boolean), provide a brief description.
  - If it is a complex type (object, array, function), provide a detailed structure, describe each sub-field, and give an example.
- Reference or link to external documentation for options that use third-party or framework types (e.g., Webpack, Express middleware).
- Mark deprecated options clearly and provide alternatives if available.

## 4. Match Documentation to Code
- Double-check that every documented option, command, and example matches the actual codebase.
- Do not document options or features that do not exist in the code (no hallucinated docs).
- If you find undocumented options in the code, add them to the documentation.

## 5. Reference Documentation in the Main README
- Add a link to the package or feature documentation in the main repository README under the Packages section.
- Use a clear description so users know where to find CLI and configuration docs.

## 6. Use Examples and Tables
- Provide example configuration files and CLI usage in code blocks.
- Use tables for option summaries, with columns for name, type, default, and description.

## 7. Organize for Readability
- Place CLI documentation in a dedicated section near the top of the README or in a separate markdown file if large.
- Place configuration documentation after CLI docs, with a summary table and detailed breakdowns for complex options.
- For large or complex projects, consider a dedicated `docs/` subdirectory for advanced topics.

## 8. Keep Documentation Up to Date
- When adding or changing CLI commands or config options, update the documentation in the same PR.
- Encourage reviewers to check for documentation accuracy as part of code review.

---

**Following these rules will ensure that documentation generated or updated by AI agents for CLI tools and configuration is accurate, discoverable, and helpful for all users and maintainers.**