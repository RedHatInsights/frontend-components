import React from 'react';
import InvalidObjectPF, { InvalidObjectProps } from '@patternfly/react-component-groups/dist/dynamic/InvalidObject';

// Don't use chrome here because the 404 page on landing does not use chrome
const isBeta = () => (window.location.pathname.split('/')[1] === 'beta' ? '/beta' : '');

/**
 * @deprecated Do not use deprecated InvalidObject import, the component has been moved to @patternfly/react-component-groups
 */
const InvalidObject: React.FunctionComponent<InvalidObjectProps> = (props) => (
  <InvalidObjectPF toHomePageUrl={`${window.location.origin}${isBeta()}`} {...props} />
);

export default InvalidObject;
