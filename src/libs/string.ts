function splitBefore(separator: string, str: string): string[] {
  const cp = str.indexOf(separator);
  return [str.slice(0, cp), str.slice(cp + 1)];
}

export { splitBefore };
