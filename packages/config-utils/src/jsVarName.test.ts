import jsVarName from './jsVarName';

describe('jsVarName', () => {
  // Test data array with input, expected output, and description
  const testCases = [
    // Dashed strings to camelCase
    { input: 'my-app-name', expected: 'myAppName', description: 'should convert dashed strings to camelCase' },
    { input: 'user-profile-component', expected: 'userProfileComponent', description: 'should handle multiple dashes' },
    { input: 'single-dash', expected: 'singleDash', description: 'should handle single dash' },
    
    // Leading digits removal
    { input: '123app', expected: 'app', description: 'should remove leading digits' },
    { input: '456my-app', expected: 'myApp', description: 'should remove leading digits with dashes' },
    { input: '789', expected: '', description: 'should handle only digits' },
    
    // Non-alphanumeric character removal
    { input: 'app@name', expected: 'appname', description: 'should remove special characters' },
    { input: 'my_app-name', expected: 'myappName', description: 'should process dashes first then remove underscores' },
    { input: 'app.name', expected: 'appname', description: 'should remove dots' },
    { input: 'app!@#$%^&*()name', expected: 'appname', description: 'should remove multiple special characters' },
    
    // Edge cases
    { input: '', expected: '', description: 'should handle empty strings' },
    { input: '!@#$%^&*()', expected: '', description: 'should handle only special characters' },
    { input: '123!@#', expected: '', description: 'should handle digits and special characters only' },
    
    // Complex combinations
    { input: '123my-app_name.component', expected: 'myAppnamecomponent', description: 'should handle complex combination of issues' },
    { input: '456user-profile@service', expected: 'userProfileservice', description: 'should handle digits, dashes and special chars' },
    
    // Valid input preservation
    { input: 'myAppName', expected: 'myAppName', description: 'should preserve valid camelCase' },
    { input: 'userProfile', expected: 'userProfile', description: 'should preserve simple camelCase' },
    
    // Single characters
    { input: 'a', expected: 'a', description: 'should handle single valid character' },
    { input: '-', expected: '', description: 'should handle single dash' },
    { input: '1', expected: '', description: 'should handle single digit' },
  ];

  // Generate individual test cases from data array
  testCases.forEach(({ input, expected, description }) => {
    it(`${description}: "${input}" -> "${expected}"`, () => {
      expect(jsVarName(input)).toBe(expected);
    });
  });

  // Documentation validation test
  it('should match documentation examples', () => {
    // This validates our documentation is accurate
    const varName = jsVarName('my-app-name');
    expect(varName).toBe('myAppName');
    expect(typeof varName).toBe('string');
    expect(varName.length).toBeGreaterThan(0);
  });
});