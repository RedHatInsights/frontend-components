import React from 'react';
import { mount } from 'enzyme';
import {
    TextContent,
    Text,
    TextList,
    TextListItem
} from '@patternfly/react-core';

import * as OpToken from '../../../addSourceWizard/hardcodedComponents/openshift/token';

describe('AWS-Access key hardcoded schemas', () => {
    it('ARN DESCRIPTION is rendered correctly', () => {
        const wrapper = mount(<OpToken.DescriptionSummary />);

        expect(wrapper.find(TextContent)).toHaveLength(1);
        expect(wrapper.find(Text)).toHaveLength(2);
        expect(wrapper.find(TextList)).toHaveLength(1);
        expect(wrapper.find(TextListItem)).toHaveLength(3);
    });
});
