import React from 'react';
import Severity, { SeverityProps } from '@patternfly/react-component-groups/dist/dynamic/Severity';

/**
 * @deprecated Do not use deprecated LowBattery import, the component has been moved to @patternfly/react-component-groups
 */

const LowBattery = (props: SeverityProps) => <Severity {...props} severity="minor" />;

export default LowBattery;
