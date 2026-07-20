/**
 * Ouia configurable properties
 * */
export interface OuiaProps {
  ouiaId?: string /** ouia-component-id set to the ouia wrapper */;
  ouiaSafe?: boolean /** oiua-safe - defaults to true if not defined */;
}

/**
 * Ouia data attributes to be set to the container of the Ouia component
 */
export interface OuiaDataAttributes {
  'data-ouia-component-type': string;
  'data-ouia-component-id'?: string;
  'data-ouia-safe': boolean;
}

interface OuiaParams extends OuiaProps {
  fullType: string;
}

/**
 * Utility function to clean all the OuiaProps from an object
 * @param props Object that extends from OuiaProps
 */
export const withoutOuiaProps = <T extends OuiaProps>(props: T): Omit<T, 'ouiaId' | 'ouiaSafe'> => {
  const { ouiaId, ouiaSafe, ...rest } = props;
  return rest;
};

export const makeOuiaAttributes = (params: OuiaParams): OuiaDataAttributes => {
  const ouiaData: OuiaDataAttributes = {
    'data-ouia-component-type': params.fullType,
    'data-ouia-safe': params.ouiaSafe ?? true,
  };

  if (params.ouiaId) {
    ouiaData['data-ouia-component-id'] = params.ouiaId;
  }

  return ouiaData;
};
