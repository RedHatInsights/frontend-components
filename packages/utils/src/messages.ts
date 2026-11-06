import { defineMessages } from '@redhat-cloud-services/frontend-components-translations/localization';

export default defineMessages({
  parseCvssScoreNA: { id: 'utils.parseCvssScore.nA', defaultMessage: 'N/A' },
  parseCvssScoreUnavailableTooltip: {
    id: 'utils.parseCvssScore.unavailableTooltip',
    defaultMessage: 'CVEs published before 2005 (approximately) did not have a CVSS Base Score.',
  },
  parseCvssScoreVersion2Tooltip: {
    id: 'utils.parseCvssScore.version2Tooltip',
    defaultMessage: 'Prior to 2016 (approximately), CVEs were scored with CVSS v2.',
  },
});
