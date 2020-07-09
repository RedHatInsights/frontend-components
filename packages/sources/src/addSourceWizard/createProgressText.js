import React from 'react';
import { FormattedMessage } from 'react-intl';

const createProgressText = (formData) => {
    let progressTexts = [];
    let step = 1;

    const authAndApp = formData.endpoint && formData.application && formData.application.application_type_id;

    progressTexts.push(<FormattedMessage id="wizard.StepSendingSourceData" defaultMessage="Step 1: sending source data" />);
    if (authAndApp) {
        step++;
        progressTexts.push(<FormattedMessage
            id="wizard.StepStepSendingEndpointAndApplicationData"
            defaultMessage="Step {step}: sending endpoint and application data"
            values={{ step }} />
        );
    } else if ((formData.endpoint) && !(formData.application && formData.application.application_type_id)) {
        step++;
        progressTexts.push(<FormattedMessage id="wizard.StepStepSendingEndpointData" defaultMessage="Step {step}: sending endpoint data" values={{ step }} />);
    } else if (!(formData.endpoint) && (formData.application && formData.application.application_type_id)) {
        step++;
        progressTexts.push(<FormattedMessage id="wizard.StepStepSendingApplicationData" defaultMessage="Step {step}: sending application data" values={{ step }} />);
    }

    if (formData.endpoint) {
        step++;
        progressTexts.push(<FormattedMessage id="wizard.StepStepSendingAuthenticationData" defaultMessage="Step {step}: sending authentication data" values={{ step }} />);
    }

    if (formData.credentials || formData.billing_source) {
        step++;
        progressTexts.push(<FormattedMessage
            id="wizard.StepStepSendingCostManagementDataAndConnectingAuthenticationAndApplication"
            defaultMessage="Step {step}: sending cost management data and connecting authentication and application"
            values={{ step }}
        />);
    } else if (authAndApp) {
        step++;
        progressTexts.push(<FormattedMessage
            id="wizard.StepStepConnectingAuthenticationAndApplication"
            defaultMessage="Step {step}: connecting authentication and application"
            values={{ step }}
        />);
    }

    progressTexts.push(<FormattedMessage id="wizard.Completed" defaultMessage="Completed" />);

    return progressTexts;
};

export default createProgressText;
