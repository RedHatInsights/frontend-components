//TODO - iterate through a string and save indexes of the curly parentheses [openingIndex, closingIndex]
// slice the selector before that, if it's top level selector, add prefix in a scope above, if its nested, dont care

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

          const shouldPrependPrefix = prefixes.every((prefix) => selectors.includes(prefix));
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

  // Wrap the entire content with the prefixes
  return result.join(' ');
};

export default addPrefixToContent;
