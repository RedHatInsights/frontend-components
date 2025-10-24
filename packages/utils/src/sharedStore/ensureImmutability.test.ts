import { ensureImmutability } from './ensureImmutability';

describe('ensureImmutability', () => {
  describe('Primitive values', () => {
    it('should return primitive numbers unchanged', () => {
      expect(ensureImmutability(42)).toBe(42);
      expect(ensureImmutability(0)).toBe(0);
      expect(ensureImmutability(-1)).toBe(-1);
      expect(ensureImmutability(3.14)).toBe(3.14);
    });

    it('should return primitive strings unchanged', () => {
      expect(ensureImmutability('hello')).toBe('hello');
      expect(ensureImmutability('')).toBe('');
      expect(ensureImmutability('test string')).toBe('test string');
    });

    it('should return primitive booleans unchanged', () => {
      expect(ensureImmutability(true)).toBe(true);
      expect(ensureImmutability(false)).toBe(false);
    });

    it('should return undefined unchanged', () => {
      expect(ensureImmutability(undefined)).toBe(undefined);
    });

    it('should return null unchanged', () => {
      expect(ensureImmutability(null)).toBe(null);
    });

    it('should return symbols unchanged', () => {
      const sym = Symbol('test');
      expect(ensureImmutability(sym)).toBe(sym);
    });

    it('should return bigint unchanged', () => {
      const bigInt = BigInt(123);
      expect(ensureImmutability(bigInt)).toBe(bigInt);
    });
  });

  describe('Object values', () => {
    it('should create a new object (shallow copy)', () => {
      const original = { a: 1, b: 'test', c: true };
      const result = ensureImmutability(original);

      expect(result).toEqual(original);
      expect(result).not.toBe(original); // Different reference
    });

    it('should preserve object properties', () => {
      const original = {
        name: 'John',
        age: 30,
        active: true,
        settings: { theme: 'dark' }
      };
      const result = ensureImmutability(original);

      expect(result.name).toBe('John');
      expect(result.age).toBe(30);
      expect(result.active).toBe(true);
      expect(result.settings).toBe(original.settings); // Shallow copy - nested objects maintain reference
    });

    it('should handle empty objects', () => {
      const original = {};
      const result = ensureImmutability(original);

      expect(result).toEqual({});
      expect(result).not.toBe(original);
    });

    it('should handle objects with complex properties', () => {
      const original = {
        func: () => 'test',
        date: new Date('2023-01-01'),
        regex: /test/g,
        nested: { deep: { value: 42 } }
      };
      const result = ensureImmutability(original);

      expect(result.func).toBe(original.func);
      expect(result.date).toBe(original.date);
      expect(result.regex).toBe(original.regex);
      expect(result.nested).toBe(original.nested); // Shallow copy
      expect(result).not.toBe(original);
    });

    it('should handle objects with null values', () => {
      const original = { a: null, b: undefined, c: 0, d: false };
      const result = ensureImmutability(original);

      expect(result).toEqual({ a: null, b: undefined, c: 0, d: false });
      expect(result).not.toBe(original);
    });
  });

  describe('Array values', () => {
    it('should create a new array (shallow copy)', () => {
      const original = [1, 2, 3];
      const result = ensureImmutability(original);

      expect(result).toEqual([1, 2, 3]);
      expect(result).not.toBe(original); // Different reference
    });

    it('should preserve array elements', () => {
      const original = ['a', 'b', 'c'];
      const result = ensureImmutability(original);

      expect(result[0]).toBe('a');
      expect(result[1]).toBe('b');
      expect(result[2]).toBe('c');
      expect(result.length).toBe(3);
    });

    it('should handle empty arrays', () => {
      const original: any[] = [];
      const result = ensureImmutability(original);

      expect(result).toEqual([]);
      expect(result).not.toBe(original);
    });

    it('should handle arrays with mixed types', () => {
      const original = [1, 'test', true, null, undefined, { a: 1 }];
      const result = ensureImmutability(original);

      expect(result[0]).toBe(1);
      expect(result[1]).toBe('test');
      expect(result[2]).toBe(true);
      expect(result[3]).toBe(null);
      expect(result[4]).toBe(undefined);
      expect(result[5]).toBe(original[5]); // Shallow copy - nested objects maintain reference
      expect(result).not.toBe(original);
    });

    it('should handle arrays with nested arrays and objects', () => {
      const nestedArray = [4, 5, 6];
      const nestedObject = { nested: true };
      const original = [1, 2, 3, nestedArray, nestedObject];
      const result = ensureImmutability(original);

      expect(result).toEqual(original);
      expect(result).not.toBe(original);
      expect(result[3]).toBe(nestedArray); // Shallow copy - nested arrays maintain reference
      expect(result[4]).toBe(nestedObject); // Shallow copy - nested objects maintain reference
    });
  });

  describe('Special object types (plain object behavior)', () => {
    it('should convert Date objects to plain objects', () => {
      const original = new Date('2023-01-01');
      const result = ensureImmutability(original);

      // Spread operator on Date creates a plain object with enumerable properties
      expect(result).toEqual({});
      expect(result).not.toBe(original);
      expect(result instanceof Date).toBe(false);
    });

    it('should convert RegExp objects to plain objects', () => {
      const original = /test/gi;
      const result = ensureImmutability(original);

      // Spread operator on RegExp creates a plain object with enumerable properties
      expect(result).toEqual({});
      expect(result).not.toBe(original);
      expect(result instanceof RegExp).toBe(false);
    });

    it('should convert Error objects to plain objects', () => {
      const original = new Error('Test error');
      const result = ensureImmutability(original);

      // Spread operator on Error creates a plain object (Error properties are not enumerable)
      expect(result).toEqual({});
      expect(result).not.toBe(original);
      expect(result instanceof Error).toBe(false);
    });

    it('should return functions unchanged', () => {
      const original = function testFunc() { return 'test'; };
      const result = ensureImmutability(original);

      // Functions have typeof 'function', not 'object', so they pass through unchanged
      expect(result).toBe(original);
      expect(typeof result).toBe('function');
    });

    it('should handle functions with properties', () => {
      const original = function testFunc() { return 'test'; };
      original.customProp = 'custom';
      const result = ensureImmutability(original);

      // Functions are returned as-is
      expect(result).toBe(original);
      expect(typeof result).toBe('function');
      expect(result.customProp).toBe('custom');
    });
  });

  describe('Type preservation', () => {
    it('should preserve TypeScript types for objects', () => {
      interface TestType {
        name: string;
        count: number;
      }

      const original: TestType = { name: 'test', count: 42 };
      const result: TestType = ensureImmutability(original);

      expect(result.name).toBe('test');
      expect(result.count).toBe(42);
      expect(result).not.toBe(original);
    });

    it('should preserve TypeScript types for arrays', () => {
      const original: string[] = ['a', 'b', 'c'];
      const result: string[] = ensureImmutability(original);

      expect(result).toEqual(['a', 'b', 'c']);
      expect(result).not.toBe(original);
    });

    it('should preserve TypeScript types for primitives', () => {
      const original: number = 42;
      const result: number = ensureImmutability(original);

      expect(result).toBe(42);
      expect(typeof result).toBe('number');
    });
  });

  describe('Edge cases', () => {
    it('should handle deeply nested structures (shallow copy behavior)', () => {
      const original = {
        level1: {
          level2: {
            level3: {
              value: 'deep'
            }
          }
        }
      };
      const result = ensureImmutability(original);

      expect(result).toEqual(original);
      expect(result).not.toBe(original);
      expect(result.level1).toBe(original.level1); // Shallow copy - nested objects maintain reference
    });

    it('should handle circular references (shallow copy behavior)', () => {
      const original: any = { name: 'test' };
      original.self = original; // Circular reference

      const result = ensureImmutability(original);

      expect(result).not.toBe(original);
      expect(result.name).toBe('test');
      expect(result.self).toBe(original); // Shallow copy - circular reference maintained
    });

    it('should only copy own enumerable properties (not prototype properties)', () => {
      function TestConstructor(this: any) {
        this.instanceProp = 'instance';
      }
      TestConstructor.prototype.prototypeProp = 'prototype';

      const original = new (TestConstructor as any)();
      const result = ensureImmutability(original);

      expect(result).not.toBe(original);
      expect(result.instanceProp).toBe('instance');
      expect(result.prototypeProp).toBeUndefined(); // Prototype properties are NOT copied by spread operator
      expect(result.__proto__).not.toBe(TestConstructor.prototype); // Different prototype
    });

    it('should convert sparse arrays to dense arrays', () => {
      const original: any[] = [1, , 3]; // Sparse array with empty slot
      const result = ensureImmutability(original);

      expect(result).toEqual([1, undefined, 3]); // Sparse slot becomes undefined
      expect(result).not.toBe(original);
      expect(result.length).toBe(3);
      expect(1 in result).toBe(true); // Sparse slot is now filled with undefined
    });

    it('should handle very large objects', () => {
      const original: Record<string, number> = {};
      for (let i = 0; i < 1000; i++) {
        original[`key${i}`] = i;
      }

      const result = ensureImmutability(original);

      expect(result).toEqual(original);
      expect(result).not.toBe(original);
      expect(Object.keys(result)).toHaveLength(1000);
    });
  });
});
