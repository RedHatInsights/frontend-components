/* eslint-disable @typescript-eslint/no-use-before-define */
import PropTypes from 'prop-types';
import { SecurityIcon } from '@patternfly/react-icons/dist/dynamic/icons/security-icon';

/**
 * This was created to fix following circular dependency issue
 * src/ReportDetails/constants.js -> src/ReportDetails/RiskOfChangeIcon.js -> src/ReportDetails/constants.js
 * Please do net merge this constant back to constants.js unless the circular dependency will be removed
 */
export const riskOfChangeMeta = [
  {
    label: 'Very Low',
    description: 'Very Low severity desc for risk of change',
    IconComponent: RiskOfChangeIcon,
  },
  {
    label: 'Low',
    description: 'Low severity desc for risk of change',
    IconComponent: RiskOfChangeIcon,
  },
  {
    label: 'Moderate',
    description: 'Moderate severity desc for risk of change',
    IconComponent: RiskOfChangeIcon,
  },
  {
    label: 'High',
    description: 'High severity desc for risk of change',
    IconComponent: RiskOfChangeIcon,
  },
];

/**
 * This is the RiskOfChangeIcon component
 * it accepts severity
 * which corresponds to a level 1-4
 * 1 - low - best case scenario
 * 2 - medium
 * 3 - high
 * 4 - critical - worst case scenario
 * Also accepts a label which can be made invisible
 */
function RiskOfChangeIcon({ value, ...props }) {
  const label = riskOfChangeMeta[value - 1] && riskOfChangeMeta[value - 1].label;
  return (
    <div className={`ins-c-rule__battery battery ins-c-rule__severity-level-${value}`}>
      <i widget-type="InsightsBattery" widget-id={label} {...props}>
        <SecurityIcon className="ins-c-risk-of-change__icon" />
      </i>
      {label && label.length > 0 && <span className="ins-c-risk-of-change__label">{label}</span>}
    </div>
  );
}

RiskOfChangeIcon.propTypes = {
  value: PropTypes.number.isRequired,
};

RiskOfChangeIcon.defaultProps = {
  severity: 0,
};

export default RiskOfChangeIcon;
