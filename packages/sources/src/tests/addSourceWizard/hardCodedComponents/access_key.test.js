import React from 'react';
import {
    TextContent,
    Text,
    Popover
} from '@patternfly/react-core';

import * as AwsAccess from '../../../addSourceWizard/hardcodedComponents/aws/access_key';
import mount from '../../__mocks__/mount';

describe('AWS-Access key hardcoded schemas', () => {
    it('ARN DESCRIPTION is rendered correctly', () => {
        const wrapper = mount(<AwsAccess.DescriptionSummary />);

        expect(wrapper.find(TextContent)).toHaveLength(1);
        expect(wrapper.find(Text)).toHaveLength(2);
        expect(wrapper.find(Popover)).toHaveLength(1);
    });
});
