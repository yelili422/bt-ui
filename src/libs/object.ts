/**
 * Performs a deep merge of objects and returns a new object. Does not modify
 * objects (immutable) and merges arrays via concatenation.
 *
 * @param {...object} objects - Objects to merge
 * @returns {object} New object with merged key/values
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
function mergeDeep<T extends object>(...objects: T[]): T {
  const isObject = (obj: any): obj is object => obj && typeof obj === "object";

  return objects.reduce((prev, obj) => {
    Object.keys(obj).forEach((key) => {
      const pVal = (prev as any)[key];
      const oVal = (obj as any)[key];

      if (Array.isArray(pVal) && Array.isArray(oVal)) {
        (prev as any)[key] = pVal.concat(...oVal);
      } else if (isObject(pVal) && isObject(oVal)) {
        (prev as any)[key] = mergeDeep(pVal, oVal);
      } else {
        (prev as any)[key] = oVal;
      }
    });

    return prev;
  }, {} as T);
}

export { mergeDeep };
