const addPrefixToContent = (content: string, sassPrefix: string): string => {
  // Stack to store pairs of opening and closing curly brace indexes
  const stack: Array<[number, number | undefined]> = [];
  const result: string[] = [];
  let lastIndex = 0;
  const prefixes = sassPrefix.split(',').map((prefix) => prefix.trim());

  for (let i = 0; i < content.length; i++) {
    if (content[i] === '{') {
      stack.push([i, undefined]);
    } else if (content[i] === '}') {
      const startPair = stack.pop();
      if (startPair) {
        const [start] = startPair;
        if (start !== undefined && stack.length === 0) {
          // Top-level block
          const blockContent = content.slice(start + 1, i);
          const selectors = content.slice(lastIndex, start);
          const selectorsArr = selectors.split(',').map((prefix) => prefix.trim());

          const shouldPrependPrefix = prefixes.some((prefix) => selectorsArr.includes(prefix));
          if (!shouldPrependPrefix) {
            // Add prefix to top-level selectors
            result.push(`${sassPrefix} { ${selectors} { ${blockContent} } }`);
          } else {
            result.push(`${selectors} { ${blockContent} }`);
          }
          lastIndex = i + 1; // Update lastIndex to the next character after closing brace }
        }
      }
    }
  }

  return result.join(' ');
};

export default addPrefixToContent;
