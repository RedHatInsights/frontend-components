import React from 'react';
import Severity, { SeverityProps } from '@patternfly/react-component-groups/dist/dynamic/Severity';

/**
 * @deprecated Do not use deprecated CriticalBattery import, the component has been moved to @patternfly/react-component-groups
 */

const CriticalBattery = (props: SeverityProps) => <Severity {...props} severity="critical" />;

export default CriticalBattery;
