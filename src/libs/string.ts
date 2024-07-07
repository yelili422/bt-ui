function splitBefore(separator: string, str: string): string[] {
  const cp = str.indexOf(separator);
  if (cp === -1) {
    return [str, ''];
  }
  return [str.slice(0, cp), str.slice(cp + 1)];
}

export { splitBefore };
