function jsVarName(s: string) {
  return (
    s
      // Camel case dashes
      .replace(/-(\w)/g, (_, match) => match.toUpperCase())
      // Remove leading digits
      .replace(/^[0-9]+/, '')
      // Remove all non alphanumeric chars
      .replace(/[^A-Za-z0-9]+/g, '')
  );
}

export default jsVarName;
