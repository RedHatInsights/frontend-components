/**
 * Ensures immutability for non-primitive values by creating shallow copies.
 * Primitives are returned as-is since they are immutable by nature.
 *
 * @param value - The value to ensure immutability for
 * @returns A shallow copy for objects/arrays, or the original value for primitives
 */
export function ensureImmutability<T>(value: T): T {
  if (typeof value === 'object' && value !== null) {
    if (Array.isArray(value)) {
      return [...value] as T;
    }
    return { ...value } as T;
  }

  return value;
}
