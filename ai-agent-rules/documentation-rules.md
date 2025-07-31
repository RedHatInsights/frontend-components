# Documentation Rules for AI Code Agents

This file contains rules and guidelines for AI agents working on documentation in this repository.

## Core Principles

### 🔍 ACCURACY IS PARAMOUNT
- **NEVER document non-existent code or APIs**
- **NEVER hallucinate or create fictional examples**
- **ALWAYS verify that documented code actually exists and works**

## 📋 Documentation Requirements

### 1. Code Examples Must Be Real and Tested
- **Every code example MUST exist in the actual codebase**
- **Every code example MUST be verified by a unit test**
- **Check unit tests to confirm the example works as documented**
- **Link to or reference the test file that validates the example**

```markdown
<!-- Good Example -->
## Using the Button Component

```tsx
import { Button } from '@redhat-cloud-services/frontend-components';

<Button variant="primary">Click me</Button>
```

*This example is tested in `src/Button/Button.test.tsx`*
```

### 2. Document Only Exposed Interfaces
- **Priority 1**: Public APIs and exported components/functions
- **Priority 2**: Props interfaces and configuration options  
- **Priority 3**: Hooks and utilities that are exported
- **Priority 4**: Internal functionality (only if specifically requested)

### 3. Complete Interface Documentation
- **Document ALL levels** of nested interfaces, not just the first level
- **Expand complex types** to show their full structure
- **Include nested object shapes** with all available properties
- **Document array item types** when arrays contain objects

```markdown
<!-- ❌ BAD: Surface level only -->
| shared | array | [] | Additional shared dependencies |

<!-- ✅ GOOD: Complete nested structure -->
| shared | WebpackSharedConfig[] | [] | Additional shared dependencies |

**WebpackSharedConfig:**
| Property | Type | Description |
|----------|------|-------------|
| version | string | Required version |
| singleton | boolean | Enforce singleton |
| eager | boolean | Load eagerly |
| import | boolean | Include in bundle |
```

### 4. Example Organization
- **Separate examples** into individual sections rather than massive code blocks
- **One example per concept** to avoid overwhelming readers  
- **Group related examples** under clear subheadings
- **Progress from simple to complex** examples

```markdown
<!-- ❌ BAD: Massive example section -->
## Examples
[20 different code examples in one section]

<!-- ✅ GOOD: Organized examples -->
## Basic Usage
[Simple example]

## Configuration Options
[Configuration example]

## Advanced Features
[Complex example]

## Integration Examples
[Real-world usage]
```

### 5. Test Analysis for Documentation Quality
When asked to document specific code, **ALWAYS analyze existing tests** for that specific code only:

1. **Search for existing test files** related to the code being documented
2. **Identify gaps** where documentation examples lack test coverage
3. **Use test cases** as a source of working examples
4. **Verify documented examples** have corresponding test validation

**SCOPE RULE**: Only analyze tests for the specific code you're documenting. Don't analyze the entire package repeatedly.

### 6. Test Suggestion Workflow
After completing documentation work:

1. **If test gaps are identified**, suggest creating additional tests
2. **Be specific** about what tests would improve documentation reliability
3. **Wait for explicit approval** before creating any tests
4. **Let the operator approve or deny** the test creation suggestion

**⚠️ IMPORTANT: Only suggest tests for appropriate functions:**

- ✅ **DO suggest tests for**: Pure functions, utilities, configuration generators, input validators
- ❌ **DON'T suggest tests for**: Server startup, process spawning, file watchers, network listeners
- ⚠️ **Suggest cautiously for**: Functions with external dependencies (propose mocking strategy)

```markdown
<!-- Example test suggestion -->
## Test Coverage Analysis

I've documented the `generateConfig` function but found these test gaps:

**Missing Tests:**
- Edge case: empty configuration object
- Error handling: invalid webpack settings
- Integration: with actual webpack build

**Suggestion:** Should I create additional tests to verify these documented scenarios?
**Awaiting approval before proceeding with test creation.**
```

### 7. Verification After Writing
After creating or updating documentation:

1. **Read the actual source code** to verify accuracy
2. **Check that all mentioned props/parameters exist**
3. **Verify import paths are correct**
4. **Confirm examples match the actual API**
5. **Check ALL nested interface levels are documented**
6. **Verify examples are properly separated by concept**
7. **Look for recent changes that might affect the documentation**
8. **Analyze test coverage** for the documented code only
9. **Suggest additional tests** if gaps are found (await approval)

## 📁 File Organization

### Location Rules
- **Package docs**: `packages/[package-name]/doc/[topic].md`
- **General docs**: `docs/[category]/[topic].md`
- **Component docs**: In the same package as the component

### Documentation Size Limits
- **Maximum file size**: ~500 lines or ~30KB per documentation file
- **When to split**: If a single file covers more than 3-4 major functions/components
- **Split strategy**: Group related functionality into focused files
- **Overview requirement**: Always create an index/overview file linking to split docs

### File Structure
```
packages/
  components/
    doc/
      README.md          # Overview with links to all docs
      button.md          # Individual component docs  
      form-controls.md   # Related components grouped
      migration.md       # Migration guides
    src/
      Button/
        Button.tsx
        Button.test.tsx   # Test that validates examples
```

### Split Documentation Structure
When splitting large documentation files:

```
packages/
  config-utils/
    doc/
      README.md                    # Overview and links
      core-functions.md           # federatedModules, proxy  
      utility-functions.md        # jsVarName, searchIgnoredStyles, etc.
      advanced-features.md        # FEO, extensions, etc.
      migration-guides.md         # Breaking changes, upgrades
```

### Linking Strategy
- **Root README**: Links to main documentation sections
- **Package README**: Must link to package-specific docs
- **Documentation README**: Overview with links to all split files
- **Multiple layers of links are acceptable**
- **Use relative paths for internal links**

Example linking hierarchy:
```
Root README.md → packages/config-utils/README.md → packages/config-utils/doc/README.md → packages/config-utils/doc/utility-functions.md
```

### Package README Requirements
Every package with documentation must have a README.md that:
- **Briefly describes** the package purpose
- **Lists main functions/components**
- **Links to detailed documentation** in doc/ folder
- **Provides quick installation** and basic usage example

## ✅ Documentation Workflow

### When Creating New Documentation

1. **Identify the target audience** (developers using the component)
2. **Read the source code** thoroughly
3. **Check existing unit tests** for usage patterns
4. **Create documentation with real examples**
5. **Verify every code snippet exists and works**
6. **Test all import statements and paths**
7. **Link from appropriate parent documentation**

### When Code Changes

1. **Check if documentation needs updates**
2. **Verify existing examples still work**
3. **Update any changed APIs or props**
4. **Re-run relevant unit tests**
5. **Update links if file structure changed**

## 🚫 Common Mistakes to Avoid

### Documentation Anti-Patterns
```markdown
<!-- ❌ BAD: Fictional API -->
<Button color="rainbow" size="mega">  // These props don't exist

<!-- ❌ BAD: Wrong import path -->
import { Button } from 'some-package';  // Wrong package name

<!-- ❌ BAD: Outdated example -->
<Button type="submit">  // If 'type' prop was removed

<!-- ✅ GOOD: Real, tested example -->
<Button variant="primary" size="large">  // Props that actually exist
```

### Verification Failures
- Writing docs before checking the actual code
- Copying examples from other projects without verification
- Not checking unit tests for correct usage patterns
- Documenting internal APIs that aren't exported
- Using outdated prop names or APIs

## 🔧 Tools and Verification Methods

### Before Publishing Documentation

1. **Use file search tools** to find the actual component
2. **Read the TypeScript interfaces** for accurate prop lists
3. **Check unit test files** for working examples
4. **Verify import paths** by checking package.json exports
5. **Test documentation examples** in the demo app if possible

### Code Verification Commands
```bash
# Find the actual component file
find packages -name "Button.tsx"

# Check exports in package
cat packages/components/src/index.ts | grep Button

# Find and read unit tests
find packages -name "*.test.tsx" | grep Button
```

## 📝 Documentation Templates

### Component Documentation Template
```markdown
# ComponentName

Brief description of what the component does.

## Installation

```bash
npm install @redhat-cloud-services/frontend-components
```

## Basic Usage

```tsx
import { ComponentName } from '@redhat-cloud-services/frontend-components';

<ComponentName prop="value" />
```

*Tested in: `src/ComponentName/ComponentName.test.tsx`*

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| prop | string | undefined | Description |

*Props verified from: `src/ComponentName/ComponentName.tsx`*

## Examples

[Real, tested examples only]

## Tests

Link to test files that validate these examples.
```

## 🚨 Critical Reminders

1. **ACCURACY OVER SPEED**: Take time to verify everything
2. **NO HALLUCINATION**: If unsure, check the code or ask
3. **REAL EXAMPLES ONLY**: Every example must be testable
4. **MAINTAIN LINKS**: Ensure documentation hierarchy works
5. **UPDATE WITH CODE**: Documentation changes with code changes

## Emergency Verification Checklist

Before publishing ANY documentation:

- [ ] All code examples exist in the codebase
- [ ] All prop names/types are accurate
- [ ] Import paths are correct
- [ ] Examples are covered by unit tests
- [ ] Documentation is in the correct location
- [ ] Links work and follow the hierarchy
- [ ] All nested interface levels are documented completely
- [ ] Examples are separated by concept, not in massive blocks
- [ ] No internal APIs are documented unless requested
- [ ] Test analysis completed for the specific documented code only
- [ ] Test coverage gaps identified and reported
- [ ] Test suggestions made (if applicable) with approval requested
- [ ] Documentation file size is reasonable (~500 lines max)
- [ ] Large docs are split into focused files with overview/index
- [ ] Package README links to detailed documentation
