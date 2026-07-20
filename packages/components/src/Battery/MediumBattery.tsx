import React from 'react';
import Severity, { SeverityProps } from '@patternfly/react-component-groups/dist/dynamic/Severity';

/**
 * @deprecated Do not use deprecated MediumBattery import, the component has been moved to @patternfly/react-component-groups
 */

const MediumBattery = (props: SeverityProps) => <Severity {...props} severity="moderate" />;

export default MediumBattery;
