import React from 'react';

import { Popover } from '@patternfly/react-core';
import { QuestionCircleIcon } from '@patternfly/react-icons';

import SSLFormLabel from '../../addSourceWizard/SSLFormLabel';
import mount from '../__mocks__/mount';

describe('SSLFormLabel', () => {
    it('renders loading step correctly', () => {
        const wrapper = mount(<SSLFormLabel />);
        expect(wrapper.find(Popover)).toHaveLength(1);
        expect(wrapper.find(QuestionCircleIcon)).toHaveLength(1);
    });
});
