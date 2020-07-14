import React from 'react';
import mount from '../../__mocks__/mount';
import {
    TextContent,
    Text,
    TextList,
    TextListItem,
    ClipboardCopy
} from '@patternfly/react-core';

import * as SubsAwsArn from '../../../addSourceWizard/hardcodedComponents/aws/subscriptionWatch';

describe('AWS-ARN hardcoded schemas', () => {
    it('ARN DESCRIPTION is rendered correctly', () => {
        const wrapper = mount(<SubsAwsArn.ArnDescription />);

        expect(wrapper.find(TextContent)).toHaveLength(1);
        expect(wrapper.find(Text)).toHaveLength(1);
        expect(wrapper.find(TextList)).toHaveLength(1);
        expect(wrapper.find(TextListItem)).toHaveLength(2);
    });

    it('IAM POLICY is rendered correctly', () => {
        const wrapper = mount(<SubsAwsArn.IAMPolicyDescription />);

        expect(wrapper.find(TextContent)).toHaveLength(1);
        expect(wrapper.find(Text)).toHaveLength(2);
        expect(wrapper.find(TextList)).toHaveLength(1);
        expect(wrapper.find(TextListItem)).toHaveLength(3);
        expect(wrapper.find(ClipboardCopy)).toHaveLength(1);
    });

    it('IAM ROLE is rendered correctly', () => {
        const CM_ID = '372779871274';
        const wrapper = mount(<SubsAwsArn.IAMRoleDescription />);

        expect(wrapper.find(TextContent)).toHaveLength(1);
        expect(wrapper.find(Text)).toHaveLength(1);
        expect(wrapper.find(TextList)).toHaveLength(1);
        expect(wrapper.find(TextListItem)).toHaveLength(4);
        expect(wrapper.find(ClipboardCopy)).toHaveLength(1);
        expect(wrapper.find(ClipboardCopy).html().includes(CM_ID)).toEqual(true);
    });
});
