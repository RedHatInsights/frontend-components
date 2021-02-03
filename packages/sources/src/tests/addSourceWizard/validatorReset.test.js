import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';

import FormRenderer from '@data-driven-forms/react-form-renderer/dist/esm/form-renderer';
import componentTypes from '@data-driven-forms/react-form-renderer/dist/esm/component-types';
import TextField from '@data-driven-forms/pf4-component-mapper/dist/esm/text-field';
import FormTemplate from '@data-driven-forms/pf4-component-mapper/dist/esm/form-template';

import ValidatorReset from '../../addSourceWizard/ValidatorReset';

describe('validatorReset', () => {
    it('sets value on timeout after mount and remove value after unmnout', async () => {
        jest.useFakeTimers();

        const onSubmit = jest.fn();
        let wrapper;

        await act(async () => {
            wrapper = mount(<FormRenderer
                componentMapper={{
                    reset: ValidatorReset,
                    [componentTypes.TEXT_FIELD]: TextField
                }}
                schema={{
                    fields: [{
                        name: 'show',
                        component: componentTypes.TEXT_FIELD
                    }, {
                        name: 'reset',
                        component: 'reset',
                        condition: {
                            when: 'show',
                            is: 'true'
                        }
                    }]
                }}
                onSubmit={(values) => onSubmit(values)}
                FormTemplate={FormTemplate}
            />);
        });

        wrapper.update();

        await act(async () => {
            wrapper.find('input').instance().value = 'true';
            wrapper.find('input').simulate('change');
            jest.advanceTimersByTime(1);
        });
        wrapper.update();

        await act(async () => {
            wrapper.find('form').simulate('submit');
        });
        wrapper.update();

        expect(onSubmit).toHaveBeenCalledWith({ show: 'true', reset: '1' });
        onSubmit.mockClear();

        await act(async () => {
            wrapper.find('input').instance().value = 'false';
            wrapper.find('input').simulate('change');
            jest.advanceTimersByTime(1);
        });
        wrapper.update();

        await act(async () => {
            wrapper.find('form').simulate('submit');
        });
        wrapper.update();

        expect(onSubmit).toHaveBeenCalledWith({ show: 'false', reset: '' });
        onSubmit.mockClear();
    });
});
