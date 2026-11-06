import { FormattedMessage } from '@redhat-cloud-services/frontend-components-translations/localization';
import React from 'react';
import { Label, Tooltip } from '@patternfly/react-core';
import messages from '../messages';

function parseCvssScore(cvssV2?: string | number, cvssV3?: string | number, withLabels = false) {
  const v2Tooltip = <FormattedMessage {...messages.parseCvssScoreVersion2Tooltip} />;
  const naTooltip = <FormattedMessage {...messages.parseCvssScoreUnavailableTooltip} />;
  return (
    (cvssV3 && parseFloat(cvssV3 as string).toFixed(1)) ||
    (cvssV2 && (
      <Tooltip content={v2Tooltip} position={'left'}>
        <span>
          {`${parseFloat(cvssV2 as string).toFixed(1)}`}{' '}
          {withLabels && (
            <Label variant="outline" isCompact>
              CVSS 2.0
            </Label>
          )}
        </span>
      </Tooltip>
    )) || (
      <Tooltip content={naTooltip} position={'left'}>
        <span>
          <FormattedMessage {...messages.parseCvssScoreNA} />
        </span>
      </Tooltip>
    )
  );
}

export default parseCvssScore;
