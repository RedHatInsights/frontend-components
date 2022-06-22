import React from 'react';
import { OuiaDataAttributes, OuiaProps, makeOuiaAttributes } from './Ouia';

/**
 * Parameters to configure the attributes of the Ouia component.
 */
export type WithOuiaParams =
  | string
  | {
      type: string;
      module?: string;
      InnerComponent?: React.ComponentType<OuiaDataAttributes> | string;
    };

/**
 * High order component to wrap a Ouia component. Allows to set the component-type, safe and component-id properties
 * @param Component component that we are wrapping
 * @param params allows to provide some configuration for the component, it can be a single string to set it as a type
 * or an object to allow to configure the type, module and InnerComponent.
 * @returns a Component that wraps it's content in a Ouia component.
 */
const WithOuia = <P,>(Component: React.ComponentType<P>, params: WithOuiaParams) => {
  const type = typeof params === 'string' ? params : params.module ? `${params.module}/${params.type}` : params.type;
  const InnerComponent = typeof params !== 'string' && params.InnerComponent !== undefined ? params.InnerComponent : 'div';

  const withOuia: React.ComponentType<P & OuiaProps> = (props) => {
    const ouiaData = makeOuiaAttributes({
      fullType: type,
      ouiaId: props.ouiaId,
      ouiaSafe: props.ouiaSafe,
    });

    return (
      <InnerComponent {...ouiaData}>
        <Component {...props}>{props.children}</Component>
      </InnerComponent>
    );
  };

  return withOuia;
};

export default WithOuia;
