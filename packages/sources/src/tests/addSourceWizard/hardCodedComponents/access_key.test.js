import React from 'react';
import { mount } from 'enzyme';
import {
    TextContent,
    Text,
    Popover
} from '@patternfly/react-core';

import * as AwsAccess from '../../../addSourceWizard/hardcodedComponents/aws/access_key';

describe('AWS-Access key hardcoded schemas', () => {
    it('ARN DESCRIPTION is rendered correctly', () => {
        const wrapper = mount(<AwsAccess.DescriptionSummary />);

        expect(wrapper.find(TextContent)).toHaveLength(1);
        expect(wrapper.find(Text)).toHaveLength(3);
        expect(wrapper.find(Popover)).toHaveLength(1);
    });
});
