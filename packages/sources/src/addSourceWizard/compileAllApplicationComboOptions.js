import React from 'react';

import { getActiveVendor, NO_APPLICATION_VALUE, REDHAT_VENDOR } from '../utilities/stringConstants';

import { COST_MANAGEMENT_APP_NAME, CLOUD_METER_APP_NAME } from '../api/constants';
import { Label } from '@patternfly/react-core';
import SubWatchDescription from './descriptions/SubWatchDescription';

export const descriptionMapper = (type, intl) => ({
    [COST_MANAGEMENT_APP_NAME]: intl.formatMessage({
        id: 'cost.app.description',
        defaultMessage: 'Analyze, forecast, and optimize your Red Hat OpenShift cluster costs in hybrid cloud environments.'
    }),
    [CLOUD_METER_APP_NAME]: <SubWatchDescription id={type.id} />
}[type.name]);

export const labelMapper = (type, intl) => ({
    [CLOUD_METER_APP_NAME]: <span className="ins-c-sources__wizard--rhel-mag-label">RHEL management <Label className="pf-u-ml-sm" color="purple">{
        intl.formatMessage({ id: 'sub.bundle', defaultMessage: 'Bundle' })
    }</Label></span>
}[type.name]);

export const compileAllApplicationComboOptions = (applicationTypes, intl) => (
    [
        ...applicationTypes.sort((a, b) => a.display_name.localeCompare(b.display_name)).map(t => ({
            value: t.id,
            label: labelMapper(t, intl) || t.display_name,
            description: descriptionMapper(t, intl)
        })),
        ...(getActiveVendor() !== REDHAT_VENDOR ? [{
            label: intl.formatMessage({
                id: 'wizard.noApplication',
                defaultMessage: 'No application'
            }),
            value: NO_APPLICATION_VALUE
        }] : [])
    ]
);
