import t_global_breakpoint_xs from '@patternfly/react-tokens/dist/js/t_global_breakpoint_xs';
import t_global_breakpoint_sm from '@patternfly/react-tokens/dist/js/t_global_breakpoint_sm';
import t_global_breakpoint_md from '@patternfly/react-tokens/dist/js/t_global_breakpoint_md';
import t_global_breakpoint_lg from '@patternfly/react-tokens/dist/js/t_global_breakpoint_lg';
import t_global_breakpoint_xl from '@patternfly/react-tokens/dist/js/t_global_breakpoint_xl';
import t_global_breakpoint_2xl from '@patternfly/react-tokens/dist/js/t_global_breakpoint_2xl';

function getPxValue(token: { value: string }) {
  const pixelsPerRem = 16;
  return parseInt(token.value.replace('rem', '')) * pixelsPerRem;
}
const breakPoints = {
  xs: getPxValue(t_global_breakpoint_xs),
  sm: getPxValue(t_global_breakpoint_sm),
  md: getPxValue(t_global_breakpoint_md),
  lg: getPxValue(t_global_breakpoint_lg),
  xl: getPxValue(t_global_breakpoint_xl),
  '2xl': getPxValue(t_global_breakpoint_2xl),
};

export default breakPoints;
