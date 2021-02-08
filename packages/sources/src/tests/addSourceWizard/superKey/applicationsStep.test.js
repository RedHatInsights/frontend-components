import React from 'react';

import { Label } from '@patternfly/react-core';

import componentTypes from '@data-driven-forms/react-form-renderer/dist/esm/component-types';
import applicationsStep from '../../../addSourceWizard/superKey/applicationsStep';
import applicationTypes from '../../helpers/applicationTypes';
import SubWatchDescription from '../../../addSourceWizard/descriptions/SubWatchDescription';

describe('applicationsStep', () => {
    it('generates applications step', () => {
        const INTL = { formatMessage: ({ defaultMessage }) => defaultMessage };

        const result = applicationsStep(applicationTypes, INTL);

        expect(result.name).toEqual('select_applications');
        expect(result.title).toEqual('Select applications');
        expect(result.nextStep).toEqual('summary');
        expect(result.fields).toHaveLength(2);

        expect(result.fields[0].component).toEqual(componentTypes.PLAIN_TEXT);
        expect(result.fields[0].label).toEqual(
            // eslint-disable-next-line max-len
            'Configuring your cloud sources provides additional capabilities included with your subscription. You can turn these features on or off at any time after source creation.'
        );

        expect(result.fields[1].component).toEqual('switch-group');
        expect(result.fields[1].label).toEqual('Available applications');
        expect(result.fields[1].applicationTypes).toEqual(applicationTypes);
        expect(result.fields[1].options).toEqual(
            [
                { description: undefined, label: 'Catalog', value: '1' },
                { description: 'Analyze, forecast, and optimize your Red Hat OpenShift cluster costs in hybrid cloud environments.', label: 'Cost Management', value: '2' },
                {
                    description: <SubWatchDescription id="5" />,
                    label: <span className="ins-c-sources__wizard--rhel-mag-label">RHEL management <Label className="pf-u-ml-sm" color="purple">Bundle</Label></span>,
                    value: '5'
                },
                { description: undefined, label: 'Topological Inventory', value: '3' }, { label: 'No application', value: '' }]
        );

    });
});
