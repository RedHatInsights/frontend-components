import React from 'react';
import { Text, TextContent, TextList, TextListItem, ClipboardCopy, Tooltip } from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';

import * as Cm from '../../../addSourceWizard/hardcodedComponents/gcp/costManagement';
import mount from '../../__mocks__/mount';

describe('Cost Management Google steps components', () => {
    it('Project', () => {
        const wrapper = mount(<Cm.Project />);

        expect(wrapper.find(TextContent)).toHaveLength(1);
        expect(wrapper.find(Text)).toHaveLength(1);
    });

    it('IAM Role', () => {
        const wrapper = mount(<Cm.IAMRole />);

        expect(wrapper.find(TextContent)).toHaveLength(1);
        expect(wrapper.find(Text)).toHaveLength(1);
        expect(wrapper.find(TextList)).toHaveLength(2);
        expect(wrapper.find(TextListItem)).toHaveLength(7);
    });

    it('Assign access', () => {
        const wrapper = mount(<Cm.AssignAccess />);

        expect(wrapper.find(TextContent)).toHaveLength(1);
        expect(wrapper.find(Text)).toHaveLength(1);
        expect(wrapper.find(TextList)).toHaveLength(1);
        expect(wrapper.find(TextListItem)).toHaveLength(4);
        expect(wrapper.find(ClipboardCopy).props().children).toEqual('billing-export@red-hat-cost-management.iam.gserviceaccount.com');
    });

    it('Dataset', () => {
        const wrapper = mount(<Cm.Dataset />);

        expect(wrapper.find(TextContent)).toHaveLength(1);
        expect(wrapper.find(Text)).toHaveLength(1);
        expect(wrapper.find(TextList)).toHaveLength(1);
        expect(wrapper.find(TextListItem)).toHaveLength(4);
        expect(wrapper.find(Tooltip)).toHaveLength(1);
        expect(wrapper.find(OutlinedQuestionCircleIcon)).toHaveLength(1);
    });

    it('Billing export', () => {
        const wrapper = mount(<Cm.BillingExport />);

        expect(wrapper.find(TextContent)).toHaveLength(1);
        expect(wrapper.find(Text)).toHaveLength(1);
        expect(wrapper.find(TextList)).toHaveLength(1);
        expect(wrapper.find(TextListItem)).toHaveLength(4);
    });
});
