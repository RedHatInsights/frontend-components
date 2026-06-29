import React from 'react';
import UnavailableContent, { UnavailableContentProps } from '@patternfly/react-component-groups/dist/dynamic/UnavailableContent';

/**
 * @deprecated Do not use deprecated UnavailableContent import, the component has been moved to @patternfly/react-component-groups
 */

const Unavailable = (props: UnavailableContentProps) => <UnavailableContent statusPageUrl="https://status.redhat.com/" {...props} />;

export default Unavailable;
