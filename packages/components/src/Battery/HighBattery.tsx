import React from 'react';
import Severity, { SeverityProps } from '@patternfly/react-component-groups/dist/dynamic/Severity';

/**
 * @deprecated Do not use deprecated HighBattery import, the component has been moved to @patternfly/react-component-groups
 */

const HighBattery: React.FunctionComponent<SeverityProps> = (props) => <Severity {...props} severity="important" />;

export default HighBattery;
