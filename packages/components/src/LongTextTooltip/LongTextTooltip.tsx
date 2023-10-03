import React from 'react';
import LongTextTooltipPF, { LongTextTooltipProps } from '@patternfly/react-component-groups/dist/dynamic/LongTextTooltip';

/**
 * @deprecated Do not use deprecated LongTextTooltip import, the component has been moved to @patternfly/react-component-groups
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LongTextTooltip: React.FunctionComponent<LongTextTooltipProps> = (props) => <LongTextTooltipPF {...props} />;

export default LongTextTooltip;
