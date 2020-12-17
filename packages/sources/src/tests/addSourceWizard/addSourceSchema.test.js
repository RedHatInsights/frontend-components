import React from 'react';
import { nextStep, iconMapper, NameDescription, SummaryDescription, sourceTypeMutator, appMutator, typesStep } from '../../addSourceWizard/SourceAddSchema';
import sourceTypes, { OPENSHIFT_TYPE } from '../helpers/sourceTypes';
import applicationTypes from '../helpers/applicationTypes';

import { TextContent, Text } from '@patternfly/react-core';

import mount from '../__mocks__/mount';
import { CLOUD_VENDOR, REDHAT_VENDOR } from '../../utilities/stringConstants';

describe('Add source schema', () => {
    describe('nextStep', () => {
        const OPENSHIFT = 'openshift';
        const APP_ID = '666';
        let formState = {
            values: {
                source_type: OPENSHIFT
            }
        };

        it('returns nextstep without selected app', () => {
            expect(nextStep(formState)).toEqual(OPENSHIFT);
        });

        it('returns nextstep with selected app', () => {
            formState = {
                values: {
                    ...formState.values,
                    application: {
                        application_type_id: APP_ID
                    }
                }
            };

            expect(nextStep(formState)).toEqual(`${OPENSHIFT}-${APP_ID}`);
        });

        it('returns nextstep with empty application', () => {
            formState = {
                values: {
                    ...formState.values,
                    application: {}
                }
            };

            expect(nextStep(formState)).toEqual(OPENSHIFT);
        });
    });

    describe('iconMapper', () => {
        let sourceTypes;
        let DefaultIcon = () => <div>Default icon</div>;

        beforeEach(() => {
            sourceTypes = [ OPENSHIFT_TYPE ];
        });

        it('returns icon', () => {
            const Icon = iconMapper(sourceTypes)(OPENSHIFT_TYPE.name, DefaultIcon);

            const wrapper = mount(<Icon />);

            const imgProps = wrapper.find('img').props();

            expect(imgProps.src).toEqual(OPENSHIFT_TYPE.icon_url);
            expect(imgProps.alt).toEqual(OPENSHIFT_TYPE.product_name);
        });

        it('returns null when no iconUrl', () => {
            sourceTypes = [{ ...OPENSHIFT_TYPE, icon_url: undefined }];

            const Icon = iconMapper(sourceTypes)(OPENSHIFT_TYPE.name, DefaultIcon);

            expect(Icon).toEqual(null);
        });

        it('returns null when no sourceType', () => {
            sourceTypes = [];

            const Icon = iconMapper(sourceTypes)(OPENSHIFT_TYPE.name, DefaultIcon);

            expect(Icon).toEqual(null);
        });
    });

    describe('descriptions', () => {
        it('renders name description', () => {
            const wrapper = mount(<NameDescription />);

            expect(wrapper.find(TextContent)).toHaveLength(1);
            expect(wrapper.find(Text)).toHaveLength(1);
        });

        it('renders summary description', () => {
            const wrapper = mount(<SummaryDescription />);

            expect(wrapper.find(TextContent)).toHaveLength(1);
            expect(wrapper.find(Text)).toHaveLength(1);
        });
    });

    describe('mutators', () => {
        const sourceTypes = [{
            product_name: 'Amazon',
            name: 'amazon'
        }, {
            product_name: 'differen type',
            name: 'ops'
        }];
        const applicationTypes = [{
            id: 'selected',
            supported_source_types: [ 'amazon' ],
            display_name: 'catalog'
        }, {
            id: 'cost',
            supported_source_types: [],
            display_name: 'cost'
        }];

        it('source type mutator limits available source types', () => {
            const formOptions = {
                getState: () => ({
                    values: {
                        application: {
                            application_type_id: 'selected'
                        }
                    }
                })
            };

            const mutator = sourceTypeMutator(applicationTypes, sourceTypes);

            expect(mutator({ label: 'differen type', value: 'ops' }, formOptions)).toEqual(
                { label: 'differen type', value: 'ops', isDisabled: true }
            );
            expect(mutator({ label: 'Amazon', value: 'amazon' }, formOptions)).toEqual(
                { label: 'Amazon', value: 'amazon', isDisabled: false }
            );
        });

        it('app type mutator limits available applications', () => {
            const formOptions = {
                getState: () => ({
                    values: {
                        source_type: 'amazon'
                    }
                })
            };

            const mutator = appMutator(applicationTypes);

            expect(mutator({ label: 'none' }, formOptions)).toEqual({ label: 'none' });
            expect(mutator({ label: 'catalog', value: 'selected' }, formOptions)).toEqual(
                { label: 'catalog', value: 'selected', isDisabled: false }
            );
            expect(mutator({ label: 'cost', value: 'cost' }, formOptions)).toEqual(
                { label: 'cost', value: 'cost', isDisabled: true }
            );
        });
    });

    describe('typesStep', () => {
        let tmpLocation;

        const INTL = { formatMessage: ({ defaultMessage }) => defaultMessage };

        beforeEach(() => {
            tmpLocation = Object.assign({}, window.location);

            delete window.location;

            window.location = {};
        });

        afterEach(() => {
            window.location = tmpLocation;
        });

        it('cloud type selection', () => {
            window.location.search = `activeVendor=${CLOUD_VENDOR}`;

            const result = typesStep(sourceTypes, applicationTypes, false, INTL);

            expect(result.fields).toHaveLength(3);
            expect(result.fields[0].name).toEqual('source_type');
            expect(result.fields[1].name).toEqual('application.application_type_id');
            expect(result.fields[1].isRequired).toEqual(undefined);
            expect(result.fields[1].validate).toEqual(undefined);
        });

        it('red hat type selection', () => {
            window.location.search = `activeVendor=${REDHAT_VENDOR}`;

            const result = typesStep(sourceTypes, applicationTypes, false, INTL);

            expect(result.fields).toHaveLength(3);
            expect(result.fields[0].name).toEqual('source_type');
            expect(result.fields[1].name).toEqual('application.application_type_id');
            expect(result.fields[1].isRequired).toEqual(true);
            expect(result.fields[1].validate).toEqual([{ type: 'required' }]);
        });
    });
});
