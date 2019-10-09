import React from 'react';
import { Title } from '@patternfly/react-core';

import {
    injectAuthFieldsInfo,
    injectEndpointFieldsInfo,
    getAdditionalAuthFields,
    getAdditionalEndpointFields,
    createTitle,
    createAuthSelection,
    createEndpointStep,
    createAdditionalSteps,
    schemaBuilder
} from '../../addSourceWizard/schemaBuilder';
import hardcodedSchemas from '../../addSourceWizard/hardcodedSchemas';
import sourceTypes from '../helpers/sourceTypes';
import applicationTypes from '../helpers/applicationTypes';

describe('schema builder', () => {
    describe('createTitle', () => {
        it('should return title step', () => {
            const TITLE = 'title title tile';

            expect(createTitle(TITLE)).toEqual({
                component: 'description',
                name: 'description-title',
                content: <Title headingLevel="h3" size="2xl">{TITLE}</Title>
            });
        });
    });

    describe('getAdditionalEndpointFields', () => {
        it('returns additionalEndpointFields for openshift', () => {
            expect(getAdditionalEndpointFields('openshift')).toEqual(
                hardcodedSchemas.openshift.endpoint.additionalFields
            );
        });

        it('returns additionalEndpointFields for amazon (empty)', () => {
            expect(getAdditionalEndpointFields('amazon')).toEqual([]);
        });
    });

    describe('getAdditionalAuthFields', () => {
        it('returns additionalAuthFields for openshift token', () => {
            expect(getAdditionalAuthFields('openshift', 'token')).toEqual(
                hardcodedSchemas.openshift.authentication.token.additionalFields
            );
        });

        it('returns additionalAuthFields for amazon arn (empty)', () => {
            expect(getAdditionalAuthFields('amazon', 'arn')).toEqual([]);
        });
    });

    describe('injectEndpointFieldsInfo', () => {
        const FIELDS = [{
            name: 'url',
            component: 'cosi'
        }];

        it('returns injected fields for openshift token', () => {
            expect(injectEndpointFieldsInfo(FIELDS, 'openshift')).toEqual([
                {
                    ...FIELDS[0],
                    ...hardcodedSchemas.openshift.endpoint.url
                }
            ]);
        });

        it('returns uninjected fields', () => {
            expect(injectEndpointFieldsInfo(FIELDS, 'amazon')).toEqual(FIELDS);
        });
    });

    describe('injectAuthFieldsInfo', () => {
        const FIELDS = [{
            name: 'authentication.username',
            component: 'cosi'
        }];

        it('returns injected fields for amazon access_key_secret_key', () => {
            expect(injectAuthFieldsInfo(FIELDS, 'amazon', 'access_key_secret_key')).toEqual([
                {
                    ...FIELDS[0],
                    ...hardcodedSchemas.amazon.authentication.access_key_secret_key['authentication.username']
                }
            ]);
        });

        it('returns uninjected fields', () => {
            expect(injectAuthFieldsInfo(FIELDS, 'openshift', 'token')).toEqual(FIELDS);
        });
    });

    describe('createAuthSelection', () => {
        it('returns authSelection for Amazon', () => {
            expect(createAuthSelection(sourceTypes.find(({ name }) => name === 'amazon'), applicationTypes, sourceTypes, [{ component: 'cosi' }])).toEqual(
                expect.objectContaining({
                    fields: expect.any(Array),
                    title: expect.any(String),
                    stepKey: 'amazon',
                    name: 'amazon',
                    nextStep: {
                        when: expect.any(String),
                        stepMapper: {
                            arn: 'amazon-arn-additional-step',
                            access_key_secret_key: 'summary' //eslint-disable-line camelcase
                        }
                    }
                })
            );
        });
    });

    describe('createEndpointStep', () => {
        it('returns createEndpointStep for openshift', () => {
            const ENDPOINT = sourceTypes.find(({ name }) => name === 'openshift').schema.endpoint;

            expect(createEndpointStep(ENDPOINT, 'openshift')).toEqual(
                expect.objectContaining({
                    fields: [
                        createTitle(ENDPOINT.title),
                        ...getAdditionalEndpointFields('openshift'),
                        ...injectEndpointFieldsInfo(ENDPOINT.fields, 'openshift')
                    ],
                    title: sourceTypes.find(({ name }) => name === 'openshift').schema.endpoint.title,
                    stepKey: 'openshift-endpoint',
                    nextStep: 'summary'
                })
            );
        });
    });

    describe('createAdditionalSteps', () => {
        const ADDITIONAL_STEPS = [
            { name: 'step-1', nextStep: 'step-2', fields: [ 'a' ] },
            { name: 'step-2', stepKey: 'step-2', nextStep: 'step-3', fields: [ 'b' ] },
            { name: 'step-3', stepKey: 'step-3', fields: [ 'c' ] }
        ];

        it('returns createAdditionalSteps', () => {
            const HAS_ENDPOINT = false;

            expect(createAdditionalSteps(ADDITIONAL_STEPS, 'red', 'hat', HAS_ENDPOINT)).toEqual([
                {
                    ...ADDITIONAL_STEPS[0],
                    fields: expect.any(Array),
                    nextStep: 'step-2',
                    stepKey: 'red-hat-additional-step'
                },
                {
                    ...ADDITIONAL_STEPS[1],
                    fields: expect.any(Array),
                    nextStep: 'step-3'
                },
                {
                    ...ADDITIONAL_STEPS[2],
                    fields: expect.any(Array),
                    nextStep: 'summary'
                }
            ]);
        });

        it('returns createAdditionalSteps with endpoint', () => {
            const HAS_ENDPOINT = true;

            expect(createAdditionalSteps(ADDITIONAL_STEPS, 'red', 'hat', HAS_ENDPOINT)).toEqual([
                {
                    ...ADDITIONAL_STEPS[0],
                    fields: expect.any(Array),
                    nextStep: 'step-2',
                    stepKey: 'red-hat-additional-step'
                },
                {
                    ...ADDITIONAL_STEPS[1],
                    fields: expect.any(Array),
                    nextStep: 'step-3'
                },
                {
                    ...ADDITIONAL_STEPS[2],
                    fields: expect.any(Array),
                    nextStep: 'red-endpoint'
                }
            ]);
        });
    });

    describe('schemaBuilder', () => {
        it('builds schema', () => {
            const schema = schemaBuilder(sourceTypes.filter(({ schema }) => schema), applicationTypes);

            expect(schema).toEqual(expect.arrayContaining([ expect.any(Object) ]));

            // 4x AuthSelection: Ansible, Azure, AWS, Openshift
            // 1x AWS ARN additional steps
            // 1x Openshift endpoint
            // 1x Ansible endpoint
            expect(schema).toHaveLength(7);
        });
    });
});
