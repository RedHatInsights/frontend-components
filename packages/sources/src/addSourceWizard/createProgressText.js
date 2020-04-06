const createProgressText = (formData) => {
    let progressTexts = [];
    let step = 1;

    const authAndApp = formData.endpoint && formData.application && formData.application.application_type_id;

    progressTexts.push(`Step 1: sending source data`);
    if (authAndApp) {
        progressTexts.push(`Step ${++step}: sending endpoint and application data`);
    } else if ((formData.endpoint) && !(formData.application && formData.application.application_type_id)) {
        progressTexts.push(`Step ${++step}: sending endpoint data`);
    } else if (!(formData.endpoint) && (formData.application && formData.application.application_type_id)) {
        progressTexts.push(`Step ${++step}: sending application data`);
    }

    if (formData.endpoint) {
        progressTexts.push(`Step ${++step}: sending authentication data`);
    }

    if (formData.credentials || formData.billing_source) {
        progressTexts.push(`Step ${++step}: sending cost management data and connecting authentication and application`);
    } else if (authAndApp) {
        progressTexts.push(`Step ${++step}: connecting authentication and application`);
    }

    progressTexts.push('Completed');

    return progressTexts;
};

export default createProgressText;
