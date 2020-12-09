import React from 'react';
import { FormattedMessage } from 'react-intl';

export const REDHAT_VENDOR = 'Red Hat';
export const CLOUD_VENDOR = 'Cloud';

export const getActiveVendor = () => new URLSearchParams(window.location.search).get('activeVendor');

export const WIZARD_DESCRIPTION = () => getActiveVendor() === CLOUD_VENDOR
    ? <FormattedMessage id="wizard.wizardDescriptionCloud" defaultMessage="Connect your Red Hat account to your external cloud account."/>
    : <FormattedMessage id="wizard.wizardDescriptionRedhat" defaultMessage="Configure a data source to connect to your Red Hat applications."/>;
export const WIZARD_TITLE = () => getActiveVendor() === CLOUD_VENDOR
    ? <FormattedMessage id="wizard.wizardTitleCloud" defaultMessage="Add cloud source"/>
    : <FormattedMessage id="wizard.wizardTitleRedhat" defaultMessage="Add Red Hat source"/>;
export const HCCM_DOCS_PREFIX = 'https://access.redhat.com/documentation/en-us/openshift_container_platform/4.6';
