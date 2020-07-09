import React from 'react';
import { Popover, Button } from '@patternfly/react-core';
import ValuePopover from '../../../sourceFormRenderer/components/ValuePopover';

import mount from '../../__mocks__/mount';

describe('ValuePopover', () => {
    it('renders correctly', () => {
        const wrapper = mount(<ValuePopover
            label="Some label"
            value="Some value"
        />);

        expect(wrapper.find(Popover).props().bodyContent).toEqual('Some value');
        expect(wrapper.find(Popover).props().headerContent).toEqual('Some label');
        expect(wrapper.find(Button)).toHaveLength(1);
    });
});
