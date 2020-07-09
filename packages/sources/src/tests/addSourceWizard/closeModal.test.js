import React from 'react';
import { Modal, Button, Text, TextContent } from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';

import CloseModal from '../../addSourceWizard/CloseModal';

import mount from '../__mocks__/mount';

describe('CloseModal', () => {
    let initialProps;
    let onExit;
    let onStay;
    let isOpen;

    beforeEach(() => {
        onExit = jest.fn();
        onStay = jest.fn();
        isOpen = true;

        initialProps = {
            onExit,
            onStay,
            isOpen
        };
    });

    it('renders correctly', () => {
        const wrapper = mount(<CloseModal {...initialProps} />);

        expect(wrapper.find(Modal)).toHaveLength(1);
        expect(wrapper.find(Button)).toHaveLength(3);
        expect(wrapper.find(ExclamationTriangleIcon)).toHaveLength(1);
        expect(wrapper.find(Text)).toHaveLength(1);
        expect(wrapper.find(TextContent)).toHaveLength(1);
    });

    it('renders correctly with custom title', () => {
        initialProps = {
            ...initialProps,
            title: 'CUSTOM TITLE'
        };

        const wrapper = mount(<CloseModal {...initialProps} />);

        expect(wrapper.find(Modal)).toHaveLength(1);
        expect(wrapper.find(Button)).toHaveLength(3);
        expect(wrapper.find(ExclamationTriangleIcon)).toHaveLength(1);
        expect(wrapper.find(Text)).toHaveLength(1);
        expect(wrapper.find(Text).text()).toEqual(initialProps.title);
        expect(wrapper.find(TextContent)).toHaveLength(1);
    });

    it('calls onExit', () => {
        const wrapper = mount(<CloseModal {...initialProps} />);

        wrapper.find(Button).at(1).simulate('click');

        expect(onExit).toHaveBeenCalled();
    });

    it('calls onStay', () => {
        const wrapper = mount(<CloseModal {...initialProps} />);

        wrapper.find(Button).at(0).simulate('click');

        expect(onStay).toHaveBeenCalled();
        onStay.mockClear();

        wrapper.find(Button).at(2).simulate('click');

        expect(onStay).toHaveBeenCalled();
        onStay.mockClear();
    });
});
