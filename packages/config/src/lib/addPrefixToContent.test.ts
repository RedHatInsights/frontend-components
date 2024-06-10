import addPrefixToContent from './addPrefixToContent';

expect.extend({
  toEqualIgnoringWhitespace(received, expected) {
    const normalize = (str: string) => str.replace(/\s+/g, '');
    const pass = normalize(received) === normalize(expected);

    if (pass) {
      return {
        message: () => `expected ${received} not to equal (ignoring whitespace) ${expected}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to equal (ignoring whitespace) ${expected}`,
        pass: false,
      };
    }
  },
});

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
        }`;
    expect(addPrefixToContent(content, prefix)).toEqualIgnoringWhitespace(output);
  });

  test('should handle multiple top-level selectors in one string', () => {
    const content = `.learningResources-learningResources{overflow-y:auto}.widget-learning-resources{column-width:300px}`;
    const prefix = '.learningResources, .learning-resources';
    const output = `.learningResources, .learning-resources { .learningResources-learningResources {overflow-y:auto}}.learningResources, .learning-resources { .widget-learning-resources {column-width:300px}}`;
    console.log(`real output: ${addPrefixToContent(content, prefix)}`);
    expect(addPrefixToContent(content, prefix)).toEqualIgnoringWhitespace(output);
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
    expect(addPrefixToContent(content, prefix)).toEqualIgnoringWhitespace(output);
  });

  test('should handle deeply nested selectors with various properties and pseudo-classes', () => {
    const content = `
      .foo {
        .learningResources {
          .bar {
            color: blue;
            .baz:hover {
              background-color: red;
              &::before {
                content: 'before';
                display: block;
              }
            }
          }
        }
      }
      .another-element {
        margin: 0;
        padding: 0;
        .nested-class {
          border: 1px solid black;
          &:first-child {
            border-left: none;
          }
          .learning-resources {
            .wrapper {
              background-color: yellow;
                .learningResources {
                  padding: 3px;
                }
            }
          }
        }
      }
      .learning-resources {
        .learningResources {
          .nested {
            .dif {
              .container {
                .inner {
                  color: red;
                  .learningResources .learning-resources {
                    margin: 0 auto;
                  }
                }
              }
            }
          }
        }
      }
    `;
    const prefix = `.learningResources, .learning-resources`;
    const output = `
      .learningResources, .learning-resources {
        .foo {
      .learningResources {
        .bar {
          color: blue;
          .baz:hover {
            background-color: red;
            &::before {
              content: 'before';
              display: block;
            }
          }
        }
      }
    }
    }
    .learningResources, .learning-resources {
      .another-element {
      margin: 0;
      padding: 0;
      .nested-class {
        border: 1px solid black;
        &:first-child {
          border-left: none;
        }
        .learning-resources {
          .wrapper {
            background-color: yellow;
              .learningResources {
                padding: 3px;
              }
          }
        }
      }
    }
  }
    .learning-resources {
      .learningResources {
        .nested {
          .dif {
            .container {
              .inner {
                color: red;
                .learningResources .learning-resources {
                  margin: 0 auto;
                }
              }
            }
          }
        }
      }
    }
    `;
    expect(addPrefixToContent(content, prefix)).toEqualIgnoringWhitespace(output);
  });
});
