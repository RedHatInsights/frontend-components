import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';

import { componentTypes } from '@data-driven-forms/react-form-renderer';
import FormRenderer from '@data-driven-forms/react-form-renderer/dist/esm/form-renderer';
import componentMapper from '@data-driven-forms/pf4-component-mapper/dist/esm/component-mapper';
import FormTemplate from '@data-driven-forms/pf4-component-mapper/dist/esm/form-template';

import EnhancedRadio from '../../../sourceFormRenderer/components/EnhancedRadio';
import { NO_APPLICATION_VALUE } from '../../../utilities/stringConstants';

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

    it('select first when source_type and the length is one', async () => {
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

        expect(onSubmit).toHaveBeenCalledWith({
            radio: NO_APPLICATION_VALUE
        });
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
    });

    it('select first app type when source type does not support the current selection', async () => {
        const mutator = (option, formOptions) => {
            if (formOptions.getState().values.source_type === 'aws') {
                if (option.value === 'second-option') {
                    return;
                }

                return option;
            }

            if (option.value === 'aws-option') {
                return { label: 'No application', value: '' };
            }

            return option;
        };

        let wrapper;

        await act(async() => {
            wrapper = mount(<FormRenderer
                {...initialProps}
                schema={{
                    fields: [{
                        component: componentTypes.TEXT_FIELD,
                        name: 'source_type'
                    }, {
                        component: 'enhanced-radio',
                        options: [
                            { label: 'option', value: 'aws-option' },
                            { label: 'option-1', value: 'second-option' }
                        ],
                        mutator,
                        name: 'radio'
                    }]
                }}
                initialValues={{
                    source_type: 'aws'
                }}
            />);
        });
        wrapper.update();

        await act(async() => {
            wrapper.find('form').simulate('submit');
        });
        wrapper.update();

        expect(onSubmit).toHaveBeenCalledWith({
            radio: 'aws-option',
            source_type: 'aws'
        });
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
            radio: '',
            source_type: 'some-value'
        });
        onSubmit.mockReset();
    });
});
