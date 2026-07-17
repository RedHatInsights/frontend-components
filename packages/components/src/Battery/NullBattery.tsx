import React from 'react';
import Severity, { SeverityProps } from '@patternfly/react-component-groups/dist/dynamic/Severity';

/**
 * @deprecated Do not use deprecated NullBattery import, the component has been moved to @patternfly/react-component-groups
 */

const NullBattery = (props: Omit<SeverityProps, 'severity'>) => <Severity {...props} severity={'null' as SeverityProps['severity']} />;

export default NullBattery;
