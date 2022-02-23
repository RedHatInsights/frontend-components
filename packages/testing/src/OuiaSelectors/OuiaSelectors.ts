type OuiaFunction<R> = (componentType: string, componentId?: string) => R;
type OuiaSelectableElement = HTMLElement & OuiaSelectors;

// interface was modelled after testing-library queries: https://testing-library.com/docs/dom-testing-library/api-queries
interface OuiaSelectors {
  getByOuia: OuiaFunction<OuiaSelectableElement>;
  getAllByOuia: OuiaFunction<Array<OuiaSelectableElement>>;
  queryByOuia: OuiaFunction<OuiaSelectableElement | null>;
  queryAllByOuia: OuiaFunction<Array<OuiaSelectableElement>>;
}

type OuiaSearchOptions = {
  throwIfNone: boolean;
  throwIfMultiple: boolean;
};

const _ouiaSearchFunction = (
  base: HTMLElement,
  componentType: string,
  componentId: string | undefined,
  options: OuiaSearchOptions
): Array<OuiaSelectableElement> => {
  let selector = `[data-ouia-component-type="${componentType}"]`;
  if (componentId) {
    selector += `[data-ouia-component-id="${componentId}"]`;
  }

  const result = base.querySelectorAll<HTMLElement>(selector);

  if (options.throwIfMultiple && result.length > 1) {
    throw new Error(`There are more than one element with the type: ${componentType} and the id ${componentId}`);
  } else if (options.throwIfNone && result.length === 0) {
    throw new Error(`There is not any element with the type: ${componentType} and the id ${componentId}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return Array.from(result).map((r) => ouiaSelectorsFor(r));
};

const _queryAllByOuia = (base: HTMLElement, componentType: string, componentId?: string): Array<OuiaSelectableElement> => {
  return _ouiaSearchFunction(base, componentType, componentId, {
    throwIfNone: false,
    throwIfMultiple: false,
  });
};

const _queryByOuia = (base: HTMLElement, componentType: string, componentId?: string): OuiaSelectableElement | null => {
  const elements = _ouiaSearchFunction(base, componentType, componentId, {
    throwIfNone: false,
    throwIfMultiple: true,
  });

  return elements.length > 0 ? elements[0] : null;
};

const _getAllByOuia = (base: HTMLElement, componentType: string, componentId?: string): Array<OuiaSelectableElement> => {
  return _ouiaSearchFunction(base, componentType, componentId, {
    throwIfNone: true,
    throwIfMultiple: false,
  });
};

const _getByOuia = (base: HTMLElement, componentType: string, componentId?: string): OuiaSelectableElement => {
  const elements = _ouiaSearchFunction(base, componentType, componentId, {
    throwIfNone: true,
    throwIfMultiple: true,
  });

  return elements[0];
};

export const ouiaSelectors: Readonly<OuiaSelectors> = {
  getByOuia: (componentType: string, componentId?: string) => _getByOuia(document.body, componentType, componentId),
  getAllByOuia: (componentType: string, componentId?: string) => _getAllByOuia(document.body, componentType, componentId),
  queryByOuia: (componentType: string, componentId?: string) => _queryByOuia(document.body, componentType, componentId),
  queryAllByOuia: (componentType: string, componentId?: string) => _queryAllByOuia(document.body, componentType, componentId),
};

export const ouiaSelectorsFor = (base: HTMLElement): Readonly<OuiaSelectableElement> => {
  return Object.assign(base, {
    getByOuia: (componentType: string, componentId?: string) => _getByOuia(base, componentType, componentId),
    getAllByOuia: (componentType: string, componentId?: string) => _getAllByOuia(base, componentType, componentId),
    queryByOuia: (componentType: string, componentId?: string) => _queryByOuia(base, componentType, componentId),
    queryAllByOuia: (componentType: string, componentId?: string) => _queryAllByOuia(base, componentType, componentId),
  });
};
