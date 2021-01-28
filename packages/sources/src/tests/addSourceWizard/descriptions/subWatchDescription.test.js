import React from 'react';
import {
    Flex,
    FlexItem,
    Stack,
    StackItem,
    Text
} from '@patternfly/react-core';

import SubWatchDescription from '../../../addSourceWizard/descriptions/SubWatchDescription';
import mount from '../../__mocks__/mount';
import { CheckCircleIcon } from '@patternfly/react-icons';

describe('SubWatchDescription', () => {
    it('Renders correctly', () => {
        const wrapper = mount(<SubWatchDescription />);

        expect(wrapper.find(CheckCircleIcon)).toHaveLength(3);
        expect(wrapper.find(Text)).toHaveLength(6);
        expect(wrapper.find(Stack)).toHaveLength(1);
        expect(wrapper.find(StackItem)).toHaveLength(3);
        expect(wrapper.find(Flex)).toHaveLength(3);
        expect(wrapper.find(FlexItem)).toHaveLength(6);
    });
});
