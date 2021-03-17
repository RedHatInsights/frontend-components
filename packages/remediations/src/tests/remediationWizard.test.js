/* eslint-disable camelcase */
import React from 'react';
import { act } from 'react-dom/test-utils';
import * as dependency from '../api/index';
import { mount } from 'enzyme';
import RemediationWizard from '../RemediationWizard/RemediationWizard';
import { remediationWizardTestData } from './testData';

describe('RemediationWizard', () => {
    let initialProps;
    let wrapper;

    beforeEach(() => {
        initialProps = {
            data: {
                issues: remediationWizardTestData.issues,
                systems: remediationWizardTestData.systems
            },
            setOpen: jest.fn()
        };
    });

    it('should render wizard correctly', async () => {
        dependency.getResolutionsBatch = jest.fn(
            () => new Promise(
                (resolve) => resolve(remediationWizardTestData.issueResolutionsResponse)
            )
        );

        await act(async() => {
            wrapper = mount(<RemediationWizard { ...initialProps }/>);
        });
        wrapper.update();
        expect(dependency.getResolutionsBatch).toHaveBeenCalledTimes(1);
        expect(wrapper.find(RemediationWizard)).toHaveLength(1);
    });
});
