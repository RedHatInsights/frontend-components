# Testing Rules for AI Code Agents

This file contains rules and guidelines for AI agents working on testing in this repository.

## Core Principles

### 🎯 FOCUS ONLY ON TESTS
- **When asked to write tests, focus ONLY on testing code**
- **DO NOT make source code changes by default**
- **Test the code as it exists, not as you think it should be**

### 🐛 Bug Handling During Testing
If you discover potential bugs in source code while writing tests:

1. **STOP immediately** - Do not fix the source code
2. **Ask for explicit permission** to fix the issue
3. **Explain WHY you think the code is broken**
4. **Propose the specific fix** you would make
5. **Wait for approval** before making any source code changes

```markdown
<!-- Example Bug Report -->
**Potential Bug Found:**
In `src/Component.tsx` line 42, the function `handleClick` doesn't handle the case when `data` is null, which will cause a runtime error.

**Proposed Fix:**
Add null check: `if (!data) return;` before accessing `data.property`

**Should I proceed with this fix?**
```

## Test Type Selection

### Use Jest Unit Tests For:
- ✅ **Utility functions** (pure functions, helpers)
- ✅ **Business logic** (calculations, data transformations)
- ✅ **API calls and data fetching**
- ✅ **Redux reducers and actions**
- ✅ **Node.js modules and configurations**
- ✅ **Simple React hooks** (that don't require prop changes)
- ✅ **Configuration generators** (webpack configs, babel transforms)
- ✅ **Input validation and transformation** (with mocked external dependencies)

### Use Cypress Component Tests For:
- ✅ **All React components** (functional and class components)
- ✅ **UI interactions** (clicks, form inputs, navigation)
- ✅ **Component state changes** and lifecycle events
- ✅ **Props and rendering behavior**
- ✅ **Accessibility testing**
- ✅ **Visual regression testing**

### ❌ NEVER Use Jest For:
- **React component rendering** (Jest only approximates browser environment)
- **DOM interactions** (clicks, form submissions, etc.)
- **Browser-specific APIs** (localStorage, window events, etc.)
- **CSS-in-JS styling** (styled-components, emotion, etc.)

### ❌ NEVER Create:
- **End-to-end (e2e) Cypress tests**
- **Integration tests spanning multiple applications**
- **Browser automation tests**

### ❌ Functions That Should NOT Be Tested:
- **Process spawning functions** (child_process.spawn, exec, fork)
- **Server startup functions** (Express app.listen, webpack-dev-server)
- **File system watchers** (chokidar, fs.watch)
- **Network listeners** (HTTP servers, WebSocket servers)
- **External service integrations** without clear input/output boundaries

### ⚠️ Test With Caution (Mock External Dependencies):
- **File system operations** (mock fs module)
- **HTTP requests** (mock request libraries)
- **Environment-dependent code** (mock process.env)
- **External package calls** (mock the package, test input validation only)

```typescript
// ✅ GOOD: Test input validation with mocked external calls
jest.mock('child_process');
const mockSpawn = jest.mocked(spawn);

test('should call spawn with correct arguments', () => {
  startServer({ port: 3000, env: 'development' });
  expect(mockSpawn).toHaveBeenCalledWith('node', ['server.js'], {
    env: { ...process.env, PORT: '3000', NODE_ENV: 'development' }
  });
});

// ❌ BAD: Trying to test actual server startup
test('should start actual server', () => {
  const server = startServer({ port: 3000 }); // This will actually start a server
  expect(server.listening).toBe(true); // Flaky, resource-intensive
});
```

## React Hooks Testing Strategies

### Simple Hooks (Use renderHook)
For hooks that don't require wrapper prop changes:

```typescript
import { renderHook } from '@testing-library/react';
import { useSimpleHook } from './useSimpleHook';

test('should return initial value', () => {
  const { result } = renderHook(() => useSimpleHook());
  expect(result.current.value).toBe('initial');
});
```

### Hooks with Changing Wrapper Props (Use Actual Components)
For hooks that need wrapper components with changing props:

```typescript
import { render, screen } from '@testing-library/react';
import { useComplexHook } from './useComplexHook';

const TestComponent = ({ propValue }: { propValue: string }) => {
  const { value } = useComplexHook(propValue);
  return <div data-testid="result">{value}</div>;
};

test('should update when wrapper prop changes', () => {
  const { rerender } = render(<TestComponent propValue="initial" />);
  expect(screen.getByTestId('result')).toHaveTextContent('initial');
  
  rerender(<TestComponent propValue="updated" />);
  expect(screen.getByTestId('result')).toHaveTextContent('updated');
});
```

**Why not renderHook?** The `renderHook` function from React Testing Library doesn't properly reflect wrapper prop changes, which can lead to false test results.

## Testing Frameworks and Tools

### Jest Configuration
- **Framework**: Jest with React Testing Library
- **Location**: Unit tests co-located with source files (`.test.ts`, `.test.tsx`)
- **Mocking**: Use Jest mocks for external dependencies
- **Coverage**: Aim for high coverage on business logic

### Cypress Configuration  
- **Framework**: Cypress Component Testing
- **Location**: `cypress/component/` directories within packages
- **Mounting**: Use `cy.mount()` for component tests
- **Assertions**: Use Cypress assertions for DOM interactions

### File Naming Conventions
```
src/
  Component/
    Component.tsx
    Component.test.tsx        // Jest unit tests (if needed for logic)
cypress/
  component/
    Component/
      Component.spec.cy.tsx   // Cypress component tests
```

## Testing Workflow

### 1. Analyze What to Test
```typescript
// Example decision process:
// ✅ Jest: Pure function
export const calculateTotal = (items: Item[]) => items.reduce((sum, item) => sum + item.price, 0);

// ✅ Cypress: React component  
export const PriceDisplay = ({ items }: { items: Item[] }) => {
  const total = calculateTotal(items);
  return <div>{total}</div>;
};
```

### 2. Write Appropriate Tests
```typescript
// Jest test for utility function
describe('calculateTotal', () => {
  it('should sum item prices correctly', () => {
    const items = [{ price: 10 }, { price: 20 }];
    expect(calculateTotal(items)).toBe(30);
  });
});
```

```typescript
// Cypress test for component
describe('PriceDisplay', () => {
  it('should display calculated total', () => {
    const items = [{ price: 10 }, { price: 20 }];
    cy.mount(<PriceDisplay items={items} />);
    cy.contains('30').should('be.visible');
  });
});
```

### 3. Run Tests and Analyze Results

**ALWAYS run tests after writing/updating them:**

#### For Jest Tests:
```bash
# Run specific test file
npm run test:unit -- ComponentName.test.tsx

# Run all tests in a package
nx run package-name:test:unit
```

#### For Cypress Component Tests:
```bash
# Run specific component test
nx run package-name:test:component -- --spec "cypress/component/ComponentName.spec.cy.tsx"

# Run all component tests
nx run package-name:test:component
```

### 4. Analyze Test Failures

When tests fail, **carefully examine the output**:

#### Jest Failure Analysis:
```bash
# Example Jest failure output:
FAIL src/utils/calculator.test.ts
● calculateTotal › should handle empty array
  expect(received).toBe(expected)
  Expected: 0
  Received: undefined

# Analysis steps:
1. Look at the specific assertion that failed
2. Check if function handles edge cases (empty array, null, undefined)
3. Examine the exact input vs expected output
4. Verify test setup and mocking
```

#### Cypress Failure Analysis:
```bash
# Example Cypress failure output:
CypressError: Timed out retrying: Expected to find element: '[data-testid="total"]', but never found it.

# Analysis steps:
1. Check if the element selector is correct
2. Verify component is mounting properly
3. Check if async operations need waiting
4. Examine component props and state
```

### 5. Fix Tests Based on Analysis

**Common Jest fixes:**
- Add missing edge case handling
- Fix assertion expectations
- Update mocks to match actual implementation
- Add proper async/await for promises

**Common Cypress fixes:**
- Use correct selectors (prefer data-testid)
- Add proper waits for async operations
- Fix component mounting with required props
- Update interactions to match actual UI behavior

### 6. Re-run Until Passing

**Iterative process:**
1. Run test
2. If fails → analyze output
3. Fix the issue identified
4. Run test again
5. Repeat until all tests pass

**Don't stop until:**
- ✅ All tests pass
- ✅ Test output is clean (no warnings)
- ✅ Tests cover the intended scenarios

## Common Patterns

### Jest Test Structure

#### Standard Test Structure
```typescript
describe('UtilityFunction', () => {
  beforeEach(() => {
    // Setup
  });

  it('should handle normal case', () => {
    // Arrange
    // Act  
    // Assert
  });

  it('should handle edge case', () => {
    // Test edge cases
  });

  it('should handle error case', () => {
    // Test error scenarios
  });
});
```

#### Helper Structure for Repetitive Input/Output Tests
When testing functions with multiple input/output scenarios, use a helper structure with test data arrays:

```typescript
describe('jsVarName', () => {
  // Test data array with input, expected output, and description
  const testCases = [
    { input: 'my-app-name', expected: 'myAppName', description: 'should convert dashed strings to camelCase' },
    { input: 'user-profile-component', expected: 'userProfileComponent', description: 'should handle multiple dashes' },
    { input: '123app', expected: 'app', description: 'should remove leading digits' },
    { input: 'app@name', expected: 'appname', description: 'should remove special characters' },
    { input: '', expected: '', description: 'should handle empty strings' },
  ];

  // Generate individual test cases from data array
  testCases.forEach(({ input, expected, description }) => {
    it(`${description}: ${input} -> ${expected}`, () => {
      expect(jsVarName(input)).toBe(expected);
    });
  });

  // Additional complex tests that don't fit the pattern
  it('should handle complex edge cases', () => {
    // More complex test logic here
  });
});
```

**Use this pattern when:**
- Testing pure functions with clear input/output pairs
- Multiple similar test scenarios exist
- Test descriptions can be generated from input/output data
- Each test case is simple and follows the same assertion pattern

**Benefits:**
- Cleaner, more maintainable test code
- Easy to add new test cases
- Consistent test descriptions
- Reduces repetitive code

### Cypress Component Test Structure
```typescript
describe('ComponentName', () => {
  it('should render with default props', () => {
    cy.mount(<ComponentName />);
    cy.get('[data-testid="component"]').should('be.visible');
  });

  it('should handle user interactions', () => {
    cy.mount(<ComponentName onSubmit={cy.stub().as('onSubmit')} />);
    cy.get('button').click();
    cy.get('@onSubmit').should('have.been.called');
  });
});
```

## Best Practices

### Jest Best Practices
- **Mock external dependencies** (APIs, third-party libraries)
- **Test edge cases** (null, undefined, empty arrays)
- **Use descriptive test names** that explain the scenario
- **Keep tests focused** on single functionality
- **Avoid testing implementation details**

### Cypress Best Practices
- **Use data-testid attributes** for reliable element selection
- **Test user workflows** not implementation details
- **Use cy.intercept()** for API mocking
- **Keep tests independent** (each test should work in isolation)
- **Test accessibility** with cy.checkA11y() when available

### General Testing Principles
- **Test behavior, not implementation**
- **Write tests that would catch real bugs**
- **Ensure tests are maintainable and readable**
- **Update tests when requirements change**

## Emergency Testing Checklist

Before writing any test:

- [ ] Have I identified if this should be Jest or Cypress?
- [ ] Am I testing the right thing (behavior vs implementation)?
- [ ] Do I need to ask permission to fix any bugs I found?
- [ ] Are my test scenarios realistic and valuable?
- [ ] Will these tests catch actual bugs?

After writing/updating tests:

- [ ] Have I run the tests to verify they work?
- [ ] If tests failed, have I analyzed the output carefully?
- [ ] Have I fixed any issues identified from test failures?
- [ ] Have I re-run tests until they all pass?
- [ ] Is the test output clean with no warnings?

## Test Execution Requirements

### 🔄 MANDATORY: Run Every Test You Write/Update

**Never submit tests without running them first:**

1. **Write test** → 2. **Run test** → 3. **Analyze output** → 4. **Fix issues** → 5. **Re-run** → 6. **Repeat until passing**

### Test Output Analysis

**Look for these common issues in test output:**

#### Jest Common Failures:
- **Assertion mismatches**: Expected vs Received values
- **Async issues**: Tests finishing before promises resolve
- **Mock problems**: Mocks not matching actual function signatures
- **Import errors**: Module not found or circular dependencies
- **Type errors**: TypeScript compilation failures

#### Cypress Common Failures:
- **Element not found**: Incorrect selectors or timing issues
- **Timeout errors**: Elements not appearing or operations taking too long
- **Assertion failures**: Expected behavior not matching actual behavior
- **Mount errors**: Component failing to render properly
- **Interaction failures**: Clicks or inputs not working as expected

### Debugging Failed Tests

**Step-by-step debugging approach:**

1. **Read error message carefully** - Often tells you exactly what's wrong
2. **Check line numbers** - Look at the specific line that failed
3. **Examine test data** - Verify inputs match expected format
4. **Check component/function implementation** - Ensure test matches actual behavior
5. **Add debugging output** - Use `console.log()` or `cy.debug()` to inspect values
6. **Run tests in isolation** - Test might be affected by other tests
7. **Check test environment** - Mocks, setup, and teardown issues

## Summary

- **Jest**: For logic, utilities, and simple hooks
- **Cypress**: For React components and UI interactions  
- **Never**: Use Jest for UI testing or create e2e tests
- **Always**: Ask permission before fixing source code bugs
- **Focus**: Only on testing when asked to write tests
- **MANDATORY**: Run every test you write/update and analyze failures
- **Iterative**: Fix issues based on test output until all tests pass