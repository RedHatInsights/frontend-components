import addPrefixToContent from './addPrefixToContent';

describe('shouldnt prefix nested selectors', () => {
  test('should add prefix above content', () => {
    const content = `.foo {
            .bar {
                color: blue;
            }
        }`;
    const prefix = '.learningResources, .learning-resources';
    const output = `.learningResources, .learning-resources {
            .foo {
                .bar {
                    color: blue;
                }
            }
        }`.replace(/\s+/g, ``);
    expect(addPrefixToContent(content, prefix).replace(/\s+/g, ``)).toEqual(output);
  });

  test('should handle multiple top-level selectors in one string', () => {
    const content = `.learningResources-learningResources{overflow-y:auto}.widget-learning-resources{column-width:300px}`;
    const prefix = '.learningResources, .learning-resources';
    const output =
      `.learningResources, .learning-resources { .learningResources-learningResources {overflow-y:auto}}.learningResources, .learning-resources { .widget-learning-resources {column-width:300px}}`.replace(
        /\s+/g,
        ``
      );
    expect(addPrefixToContent(content, prefix).replace(/\s+/g, ``)).toEqual(output);
  });

  test('should ignore nested selector containing prefix', () => {
    const content = `.foo {
        .bar {
            .learningResources, .learning-resources {
                    color: red;
            }
        }}`;
    const prefix = `.learningResources, .learning-resources`;
    const output = `.learningResources, .learning-resources {
        .foo {
            .bar {
                .learningResources, .learning-resources {
                    color: red;
                }
            }
        }
    }`;
    expect(addPrefixToContent(content, prefix).replace(/\s+/g, ``)).toEqual(output);
  });
});
