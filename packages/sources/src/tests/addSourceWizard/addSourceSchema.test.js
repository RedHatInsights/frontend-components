import React from 'react';
import {
    nextStep,
    iconMapper,
    NameDescription,
    SummaryDescription,
    sourceTypeMutator,
    typesStep,
    compileAllSourcesComboOptions,
    compileAllApplicationComboOptions,
    appMutatorRedHat,
    applicationStep
} from '../../addSourceWizard/SourceAddSchema';
import sourceTypes, { OPENSHIFT_TYPE } from '../helpers/sourceTypes';
import applicationTypes from '../helpers/applicationTypes';

import { TextContent, Text } from '@patternfly/react-core';

import mount from '../__mocks__/mount';
import { CLOUD_VENDOR, NO_APPLICATION_VALUE, REDHAT_VENDOR } from '../../utilities/stringConstants';
import SubWatchDescription from '../../addSourceWizard/descriptions/SubWatchDescription';

describe('Add source schema', () => {
    const INTL = { formatMessage: ({ defaultMessage }) => defaultMessage };

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

            expect(imgProps.src).toEqual('/apps/frontend-assets/red-hat-logos/stacked.svg');
            expect(imgProps.alt).toEqual(OPENSHIFT_TYPE.product_name);
        });

        it('returns null when no iconUrl && no short url', () => {
            sourceTypes = [{ ...OPENSHIFT_TYPE, icon_url: undefined, name: 'nonsense' }];

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
            name: 'amazon',
            id: 'amazon'
        }, {
            product_name: 'differen type',
            name: 'ops',
            id: 'openshift'
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

        it('appMutatorRedHat - undfined when unable', () => {
            const formOptions = {
                getState: () => ({
                    values: {
                        source_type: 'amazon'
                    }
                })
            };

            const mutator = appMutatorRedHat(applicationTypes);

            expect(mutator({ label: 'catalog', value: 'selected' }, formOptions)).toEqual(
                { label: 'catalog', value: 'selected' }
            );
            expect(mutator({ label: 'cost this is label', value: 'cost' }, formOptions)).toEqual(undefined);
        });
    });

    describe('typesStep', () => {
        let tmpLocation;

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
            expect(result.fields[0].mutator).toEqual(expect.any(Function));
            expect(result.fields[1].name).toEqual('application.application_type_id');
            expect(result.fields[1].component).toEqual('enhanced-radio');
            expect(result.fields[1].isRequired).toEqual(undefined);
            expect(result.fields[1].validate).toEqual(undefined);
            expect(result.fields[1].placeholder).toEqual(expect.any(String));
            expect(result.fields[1].condition).toEqual(undefined);
            expect(result.fields[1].mutator.toString()).toEqual(appMutatorRedHat(applicationTypes).toString());
        });

        it('red hat type selection', () => {
            window.location.search = `activeVendor=${REDHAT_VENDOR}`;

            const result = typesStep(sourceTypes, applicationTypes, false, INTL);

            expect(result.fields).toHaveLength(3);
            expect(result.fields[0].name).toEqual('source_type');
            expect(result.fields[0].mutator).toEqual(undefined);
            expect(result.fields[1].name).toEqual('application.application_type_id');
            expect(result.fields[1].component).toEqual('enhanced-radio');
            expect(result.fields[1].isRequired).toEqual(true);
            expect(result.fields[1].validate).toEqual([{ type: 'required' }]);
            expect(result.fields[1].placeholder).toEqual(undefined);
            expect(result.fields[1].condition).toEqual({ isNotEmpty: true, when: 'source_type' });
            expect(result.fields[1].mutator.toString()).toEqual(appMutatorRedHat(applicationTypes).toString());
        });
    });

    describe('application step', () => {
        it('generate steps and filters application not belonging to the type', () => {
            const result = applicationStep(applicationTypes, 'amazon', INTL);

            expect(result.title).toEqual('Select application');
            expect(result.fields.map(({ name }) => name)).toEqual([
                'app-description', 'application.application_type_id', 'source_type'
            ]);
            expect(result.fields[1].options).toEqual([
                { label: 'Cost Management', value: '2', description: 'Analyze, forecast, and optimize your Red Hat OpenShift cluster costs in hybrid cloud environments.' },
                { label: expect.any(Object), value: '5', description: <SubWatchDescription id="5"/> },
                { label: 'Topological Inventory', value: '3', description: undefined },
                { value: NO_APPLICATION_VALUE, label: 'No application' }
            ]);
        });
    });

    describe('compileAllSourcesComboOptions', () => {
        let tmpLocation;

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

            const mockSourceTypes = [
                { name: 'google', product_name: 'Google Cloud Provider', id: '1' },
                { name: 'aws', product_name: 'Amazon Web Services', id: '2' }
            ];

            expect(compileAllSourcesComboOptions(mockSourceTypes)).toEqual(
                [
                    { label: 'Amazon Web Services', value: 'aws' },
                    { label: 'Google Cloud Provider', value: 'google' }]
            );
        });

        it('red hat type selection - remove red hat', () => {
            window.location.search = `activeVendor=${REDHAT_VENDOR}`;

            const mockSourceTypes = [
                { name: 'ops', product_name: 'Red Hat Openshift', vendor: 'Red Hat', id: '1' },
                { name: 'sat', product_name: 'Red Hat Satellite', vendor: 'Red Hat', id: '2' }
            ];

            expect(compileAllSourcesComboOptions(mockSourceTypes)).toEqual(
                [
                    { label: 'Openshift', value: 'ops' },
                    { label: 'Satellite', value: 'sat' }]
            );
        });
    });

    describe('compileAllApplicationComboOptions', () => {
        let tmpLocation;

        const mockAppTypes = [
            { name: 'app', display_name: 'Application', id: '1' }
        ];

        const INTl = { formatMessage: ({ defaultMessage }) => defaultMessage };

        beforeEach(() => {
            tmpLocation = Object.assign({}, window.location);

            delete window.location;

            window.location = {};
        });

        afterEach(() => {
            window.location = tmpLocation;
        });

        it('cloud type selection - has none application', () => {
            window.location.search = `activeVendor=${CLOUD_VENDOR}`;

            expect(compileAllApplicationComboOptions(mockAppTypes, INTl)).toEqual(
                [{ label: 'Application', value: '1', description: undefined }, { label: 'No application', value: NO_APPLICATION_VALUE }]
            );
        });

        it('red hat type selection - is none', () => {
            window.location.search = `activeVendor=${REDHAT_VENDOR}`;

            expect(compileAllApplicationComboOptions(mockAppTypes, INTl)).toEqual(
                [{ label: 'Application', value: '1', description: undefined }]
            );
        });
    });
});
