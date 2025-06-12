import React from 'react';
import { Label, Tooltip } from '@patternfly/react-core';

function parseCvssScore(cvssV2?: string | number, cvssV3?: string | number, withLabels = false) {
  const v2Tooltip = 'Prior to 2016 (approximately), CVEs were scored with CVSS v2.';
  const naTooltip = 'CVEs published before 2005 (approximately) did not have a CVSS Base Score.';
  return (
    (cvssV3 && parseFloat(cvssV3 as string).toFixed(1)) ||
    (cvssV2 && (
      <Tooltip content={v2Tooltip} position={'left'}>
        <span>
          {`${parseFloat(cvssV2 as string).toFixed(1)}`} {withLabels && <Label variant="outline" isCompact>CVSS 2.0</Label>}
        </span>
      </Tooltip>
    )) || (
      <Tooltip content={naTooltip} position={'left'}>
        <span>N/A</span>
      </Tooltip>
    )
  );
}

export default parseCvssScore;
