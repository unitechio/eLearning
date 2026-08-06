type DeepMergeOptions = {
  /**
   * When true, arrays from source and target are concatenated.
   * When false (default), source arrays replace target arrays.
   */
  readonly mergeArrays?: boolean;
};

type PlainObject = Record<string, unknown>;

function isPlainObject(value: unknown): value is PlainObject {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.prototype.toString.call(value) === '[object Object]'
  );
}

/**
 * Recursively merges source into target, returning a new object.
 * Source values override target values for primitive and array types.
 * Plain objects are merged recursively.
 *
 * @example
 * deepMerge({ a: { b: 1 } }, { a: { c: 2 } })
 * // { a: { b: 1, c: 2 } }
 *
 * deepMerge({ arr: [1] }, { arr: [2] }, { mergeArrays: true })
 * // { arr: [1, 2] }
 */
export function deepMerge<T extends PlainObject, S extends PlainObject>(
  target: T,
  source: S,
  options: DeepMergeOptions = {}
): T & S {
  const { mergeArrays = false } = options;
  const result: PlainObject = { ...target };

  for (const key of Object.keys(source)) {
    const sourceVal = source[key];
    const targetVal = result[key];

    if (mergeArrays && Array.isArray(targetVal) && Array.isArray(sourceVal)) {
      result[key] = [...targetVal, ...sourceVal];
    } else if (isPlainObject(sourceVal) && isPlainObject(targetVal)) {
      result[key] = deepMerge(targetVal, sourceVal, options);
    } else {
      result[key] = sourceVal;
    }
  }

  return result as T & S;
}
