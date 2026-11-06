import { defineMessages } from '@redhat-cloud-services/frontend-components-translations/localization';

export default defineMessages({
  remediationLoadErrorFailedToLoad: {
    description: 'Remediations component loading error detail. {component} is the supplied component name, not a message ID.',
    id: 'remediations.remediationLoadError.failedToLoad',
    defaultMessage: 'Failed to load {component}',
  },
  remediationLoadErrorMoreInfoCanBeFoundInBrowserConsoleOutput: {
    description: 'Troubleshooting guidance beneath a remediations loading error; browser console means the browser developer console.',
    id: 'remediations.remediationLoadError.moreInfoCanBeFoundInBrowserConsoleOutput',
    defaultMessage: 'More info can be found in browser console output.',
  },
  remediationLoadErrorUnableToLoadRemediationsComponent: {
    description: 'Heading for an error state when a remote remediations component cannot load.',
    id: 'remediations.remediationLoadError.unableToLoadRemediationsComponent',
    defaultMessage: 'Unable to load remediations component',
  },
});
