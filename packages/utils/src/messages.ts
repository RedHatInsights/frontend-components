import { defineMessages } from '@redhat-cloud-services/frontend-components-translations/localization';

export default defineMessages({
  parseCvssScoreNA: {
    description: 'Displayed in place of an unavailable CVSS Base Score; N/A means a score is not available, not a numeric zero.',
    id: 'utils.parseCvssScore.nA',
    defaultMessage: 'N/A',
  },
  parseCvssScoreUnavailableTooltip: {
    description:
      'Tooltip explaining why older vulnerability records lack a CVSS Base Score. CVE and CVSS are security standard acronyms; preserve the year.',
    id: 'utils.parseCvssScore.unavailableTooltip',
    defaultMessage: 'CVEs published before 2005 (approximately) did not have a CVSS Base Score.',
  },
  parseCvssScoreVersion2Tooltip: {
    description:
      'Tooltip identifying a score calculated using CVSS version 2 for older vulnerability records. CVE and CVSS are security standard acronyms; preserve v2 and the year.',
    id: 'utils.parseCvssScore.version2Tooltip',
    defaultMessage: 'Prior to 2016 (approximately), CVEs were scored with CVSS v2.',
  },
});
