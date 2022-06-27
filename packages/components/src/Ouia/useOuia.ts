import { OuiaDataAttributes, OuiaProps, makeOuiaAttributes } from './Ouia';

/**
 * Parameters to configure the attributes of the Ouia component.
 */
export interface UseOuiaParams extends OuiaProps {
  type: string;
  module?: string;
}

/**
 * Hook to help to configure a Ouia component.
 * @param ouiaParams configuration
 * @returns an object with the OuiaDataProperties to be set to the Ouia component container.
 */
const useOuia = (ouiaParams: UseOuiaParams): OuiaDataAttributes => {
  const type = ouiaParams.module !== undefined ? `${ouiaParams.module}/${ouiaParams.type}` : ouiaParams.type;

  return makeOuiaAttributes({
    fullType: type,
    ouiaId: ouiaParams.ouiaId,
    ouiaSafe: ouiaParams.ouiaSafe,
  });
};

export default useOuia;
