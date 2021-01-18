import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';

import FormRenderer, { componentTypes } from '@data-driven-forms/react-form-renderer';
import { componentMapper, FormTemplate } from '@data-driven-forms/pf4-component-mapper';

import EnhancedRadio from '../../../sourceFormRenderer/components/EnhancedRadio';

describe('EnhancedRadio', () => {
    let onSubmit;
    let initialProps;

    beforeEach(() => {
        onSubmit = jest.fn();

        initialProps = {
            subscription: { values: true },
            onSubmit: (values) => onSubmit(values),
            FormTemplate,
            componentMapper: {
                ...componentMapper,
                'enhanced-radio': EnhancedRadio
            }
        };
    });

    it('change options according to mutator', async () => {
        const mutator = (option, formOptions) => {
            if (!option.value) {
                return;
            }

            const multiplier = formOptions.getState().values.multiplier || 1;

            return {
                ...option,
                value: option.value * multiplier
            };
        };

        const wrapper = mount(<FormRenderer
            {...initialProps}
            schema={{
                fields: [{
                    component: componentTypes.TEXT_FIELD,
                    name: 'multiplier'
                }, {
                    component: 'enhanced-radio',
                    options: [
                        { label: 'option1', value: 1 },
                        { label: 'option2', value: 2 },
                        { label: 'novalue' }
                    ],
                    mutator,
                    name: 'radio'
                }]
            }}
        />);

        expect(wrapper.find(componentMapper[componentTypes.RADIO]).props().options).toEqual([
            { label: 'option1', value: 1 },
            { label: 'option2', value: 2 }
        ]);

        await act(async() => {
            wrapper.find('input').first().instance().value = '2';
            wrapper.find('input').first().simulate('change');
        });
        wrapper.update();

        expect(wrapper.find(componentMapper[componentTypes.RADIO]).props().options).toEqual([
            { label: 'option1', value: 2 },
            { label: 'option2', value: 4 }
        ]);
    });

    it('select first when source_type is changed and clear itself when it is unselected', async () => {
        const mutator = (option) => option;

        const wrapper = mount(<FormRenderer
            {...initialProps}
            schema={{
                fields: [{
                    component: componentTypes.TEXT_FIELD,
                    name: 'source_type'
                }, {
                    component: 'enhanced-radio',
                    options: [
                        { label: 'option', value: 'first-option' }
                    ],
                    mutator,
                    name: 'radio'
                }]
            }}
        />);

        await act(async() => {
            wrapper.find('form').simulate('submit');
        });
        wrapper.update();

        expect(onSubmit).toHaveBeenCalledWith({});
        onSubmit.mockReset();

        await act(async() => {
            wrapper.find('input').first().instance().value = 'some-value';
            wrapper.find('input').first().simulate('change');
        });
        wrapper.update();

        await act(async() => {
            wrapper.find('form').simulate('submit');
        });
        wrapper.update();

        expect(onSubmit).toHaveBeenCalledWith({
            radio: 'first-option',
            source_type: 'some-value'
        });
        onSubmit.mockReset();

        await act(async() => {
            wrapper.find('input').first().instance().value = '';
            wrapper.find('input').first().simulate('change');
        });
        wrapper.update();

        await act(async() => {
            wrapper.find('form').simulate('submit');
        });
        wrapper.update();

        expect(onSubmit).toHaveBeenCalledWith({});
    });
});
