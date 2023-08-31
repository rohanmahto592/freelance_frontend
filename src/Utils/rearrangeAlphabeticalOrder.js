export function rearrangeObjectKeysAlphabetically(obj) {
  const sortedKeys = Object.keys(obj).sort();

  const reorderedObject = Object.fromEntries(
    sortedKeys.map((key) => [key, obj[key]])
  );

  return reorderedObject;
}
