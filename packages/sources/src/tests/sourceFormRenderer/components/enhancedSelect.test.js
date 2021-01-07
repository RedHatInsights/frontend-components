import React from 'react';
import { act } from 'react-dom/test-utils';

import mount from '../../__mocks__/mount';

import { Alert } from '@patternfly/react-core';
import FormRenderer, { componentTypes } from '@data-driven-forms/react-form-renderer';
import { componentMapper, FormTemplate } from '@data-driven-forms/pf4-component-mapper';

import EnhancedSelect from '../../../sourceFormRenderer/components/EnhancedSelect';

describe('EnhancedSelect', () => {
    const initialProps = {
        onSubmit: jest.fn(),
        FormTemplate: FormTemplate,
        componentMapper: {
            ...componentMapper,
            'enhanced-select': EnhancedSelect
        }
    };

    it('change options according to mutator', async () => {
        const mutator = (option, formOptions) => {
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
                    component: 'enhanced-select',
                    options: [
                        { label: 'option1', value: 1 },
                        { label: 'option2', value: 2 }
                    ],
                    mutator,
                    name: 'select'
                }]
            }}
        />);

        expect(wrapper.find(componentMapper[componentTypes.SELECT]).props().options).toEqual([
            { label: 'option1', value: 1 },
            { label: 'option2', value: 2 }
        ]);

        await act(async() => {
            wrapper.find('input').first().instance().value = '2';
            wrapper.find('input').first().simulate('change');
        });
        wrapper.update();

        expect(wrapper.find(componentMapper[componentTypes.SELECT]).props().options).toEqual([
            { label: 'option1', value: 2 },
            { label: 'option2', value: 4 }
        ]);
    });

    describe('variants', () => {
        const mutator = (option) => option;

        const schema = {
            fields: [{
                component: 'enhanced-select',
                options: [
                    { label: 'option1', value: 1 },
                    { label: 'option2', value: 2 }
                ],
                name: 'select',
                mutator
            }]
        };

        it('shows alert for AutoRegistration when AWS source', () => {
            const wrapper = mount(<FormRenderer
                {...initialProps}
                schema={schema}
                initialValues={{ source_type: 'amazon' }}
            />);

            expect(wrapper.find(Alert).props().title).toEqual('Select Subscription Watch for auto-registration');
        });

        it('doesnt show alert for AutoRegistration when not AWS source', () => {
            const wrapper = mount(<FormRenderer
                {...initialProps}
                schema={schema}
                initialValues={{ source_type: 'gcp' }}
            />);

            expect(wrapper.find(Alert)).toHaveLength(0);
        });
    });
});
