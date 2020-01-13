import React from 'react';
import { mount } from 'enzyme';
import { nextStep, iconMapper } from '../../addSourceWizard/SourceAddSchema';
import { OPENSHIFT_TYPE } from '../helpers/sourceTypes';

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

        it('returns DefaultIcon when no iconUrl', () => {
            sourceTypes = [{ ...OPENSHIFT_TYPE, icon_url: undefined }];

            const Icon = iconMapper(sourceTypes)(OPENSHIFT_TYPE.name, DefaultIcon);

            expect(Icon).toEqual(DefaultIcon);
        });

        it('returns DefaultIcon when no sourceType', () => {
            sourceTypes = [];

            const Icon = iconMapper(sourceTypes)(OPENSHIFT_TYPE.name, DefaultIcon);

            expect(Icon).toEqual(DefaultIcon);
        });
    });
});
