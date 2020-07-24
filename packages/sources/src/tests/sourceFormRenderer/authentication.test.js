import React from 'react';

import { componentTypes, validatorTypes } from '@data-driven-forms/react-form-renderer';
import { componentMapper, FormTemplate } from '@data-driven-forms/pf4-component-mapper';

import SourcesFormRenderer from '../../sourceFormRenderer';
import Authentication from '../../sourceFormRenderer/components/Authentication';
import mount from '../__mocks__/mount';

describe('Authentication test', () => {
    let schema;
    let onSubmit;
    let initialProps;

    beforeEach(() => {
        schema = {
            fields: [{
                component: 'authentication',
                name: 'authentication.password',
                validate: [
                    { type: validatorTypes.REQUIRED },
                    {
                        type: validatorTypes.MIN_LENGTH,
                        threshold: 2
                    }
                ],
                isRequired: true
            }]
        };
        onSubmit = jest.fn();
        initialProps = {
            formFieldsMapper: {
                ...componentMapper,
                authentication: Authentication
            },
            schema,
            onSubmit: (values) => onSubmit(values),
            FormTemplate
        };
    });

    it('renders with no validation', () => {
        schema = {
            fields: [{
                component: 'authentication',
                name: 'authentication.password',
                isRequired: true
            }]
        };

        const wrapper = mount(<SourcesFormRenderer
            {...initialProps}
            schema={schema}
            initialValues={{
                authentication: {
                    id: 'someid'
                }
            }}
        />);

        expect(wrapper.find(Authentication)).toHaveLength(1);
    });

    it('renders with func validation', () => {
        schema = {
            fields: [{
                component: 'authentication',
                name: 'authentication.password',
                isRequired: true,
                validate: [ () => undefined ]
            }]
        };

        const wrapper = mount(<SourcesFormRenderer
            {...initialProps}
            schema={schema}
            initialValues={{
                authentication: {
                    id: 'someid'
                }
            }}
        />);

        expect(wrapper.find(Authentication)).toHaveLength(1);
    });

    it('renders not editing', () => {
        const wrapper = mount(<SourcesFormRenderer
            {...initialProps}
        />);

        expect(wrapper.find(Authentication)).toHaveLength(1);
        expect(wrapper.find(componentMapper[componentTypes.TEXT_FIELD]).props().isRequired).toEqual(true);
        expect(wrapper.find(componentMapper[componentTypes.TEXT_FIELD]).props().helperText).toEqual(undefined);

        wrapper.find('form').simulate('submit');
        wrapper.update();

        expect(onSubmit).not.toHaveBeenCalled();

        wrapper.find('input').instance().value = 's'; // too short
        wrapper.find('input').simulate('change');
        wrapper.update();

        wrapper.find('form').simulate('submit');
        wrapper.update();

        expect(onSubmit).not.toHaveBeenCalled();

        wrapper.find('input').instance().value = 'some-value';
        wrapper.find('input').simulate('change');
        wrapper.update();

        wrapper.find('form').simulate('submit');
        expect(onSubmit).toHaveBeenCalledWith({
            authentication: {
                password: 'some-value'
            }
        });
    });

    it('renders editing and removes required validator (min length still works)', () => {
        const wrapper = mount(<SourcesFormRenderer
            {...initialProps}
            initialValues={{
                authentication: {
                    id: 'someid'
                }
            }}
        />);

        expect(wrapper.find(Authentication)).toHaveLength(1);
        expect(wrapper.find(componentMapper[componentTypes.TEXT_FIELD]).props().isRequired).toEqual(false);
        expect(wrapper.find(componentMapper[componentTypes.TEXT_FIELD]).props().helperText).toEqual('Changing this resets your current .');

        wrapper.find('form').simulate('submit');
        wrapper.update();

        expect(onSubmit).toHaveBeenCalledWith({
            authentication: {
                id: 'someid'
            }
        });
        onSubmit.mockClear();

        wrapper.find('input').instance().value = 's';
        wrapper.find('input').simulate('change');
        wrapper.update();

        wrapper.find('form').simulate('submit');
        expect(onSubmit).not.toHaveBeenCalled();
    });
});
