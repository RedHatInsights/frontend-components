import React from 'react';
import { act } from 'react-dom/test-utils';
import RemediationWizardHelper from '../RemediationWizard';
import RemediationButton from '../RemediationButton/index';
import { mount } from 'enzyme';
import { CAN_REMEDIATE } from '../utils';
import { remediationWizardTestData } from './testData';

describe('RemediationButton', () => {

    let initialProps;
    let tmpInsights;
    let openWizard;

    beforeEach(() => {
        initialProps = {
            dataProvider: () => ({
                issues: remediationWizardTestData.issues,
                systems: []
            })
        };
        tmpInsights = insights;
        openWizard = jest.fn();
        insights = {
            ...insights,
            chrome: {
                ...insights.chrome,
                getApp: () => 'remediations',
                getUserPermissions: () => Promise.resolve([{ permission: CAN_REMEDIATE }])
            },
            experimental: {
                loadRemediations: () => ({
                    RemediationWizardHelper,
                    openWizard
                })
            }
        };
    });

    afterEach(() => {
        insights = tmpInsights;
    });

    it('should open wizard with permissions', async () => {
        let wrapper;

        await act(async() => {
            wrapper = mount(<RemediationButton {...initialProps}/>);
        });
        wrapper.update();

        await act(async() => {
            wrapper.find('button').simulate('click');
        });

        expect(openWizard).toHaveBeenCalledTimes(1);
    });

    it('should not open wizard without permissions', async () => {
        insights.chrome.getUserPermissions = () => Promise.resolve([]);
        let wrapper;

        await act(async() => {
            wrapper = mount(<RemediationButton {...initialProps}/>);
        });
        wrapper.update();

        await act(async() => {
            wrapper.find('button').simulate('click');
        });

        expect(openWizard).toHaveBeenCalledTimes(0);
    });
});
