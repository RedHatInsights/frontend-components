import xsBreakpoint from '@patternfly/react-tokens/dist/esm/global_breakpoint_xs';
import smBreakpoint from '@patternfly/react-tokens/dist/esm/global_breakpoint_sm';
import mdBreakpoint from '@patternfly/react-tokens/dist/esm/global_breakpoint_md';
import lgBreakpoint from '@patternfly/react-tokens/dist/esm/global_breakpoint_lg';
import xlBreakpoint from '@patternfly/react-tokens/dist/esm/global_breakpoint_xl';
import xxlBreakpoint from '@patternfly/react-tokens/dist/esm/global_breakpoint_2xl';

const breakPoints = {
    xs: parseInt(xsBreakpoint.value.replace('px', '')),
    sm: parseInt(smBreakpoint.value.replace('px', '')),
    md: parseInt(mdBreakpoint.value.replace('px', '')),
    lg: parseInt(lgBreakpoint.value.replace('px', '')),
    xl: parseInt(xlBreakpoint.value.replace('px', '')),
    '2xl': parseInt(xxlBreakpoint.value.replace('px', ''))
};

export default breakPoints;
