const computeSourcesUrl = () => insights.chrome.isBeta() ? `/beta/settings/sources` : `/settings/sources`;

export default computeSourcesUrl;
