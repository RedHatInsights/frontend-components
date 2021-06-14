import React from 'react';
import { mount } from 'enzyme';
import Progress from '../../steps/progress';
import ProgressBar from '../../common/ProgressBar';
import { remediationWizardTestData } from '../testData';

describe('Progress', () => {

    it('should render loading progress correctly ', async () => {
        let wrapper = mount(
            <Progress
                onClose={() => null}
                title={'Adding items to the playbook'}
                setOpen={() => null}
                submitRemediation={() => null}
                setState={() => null}
                state={{
                    formValues: remediationWizardTestData.formValues,
                    percent: 0,
                    failed: false
                }}
            />
        );
        wrapper.update();
        expect(wrapper.find(Progress)).toHaveLength(1);
        expect(wrapper.find(ProgressBar)).toHaveLength(1);
        expect(wrapper.find('.pf-c-progress__description').text()).toEqual('In progress');
    });

    it('should render success progress with buttons correctly ', async () => {
        const onClose = jest.fn();
        let wrapper = mount(
            <Progress
                onClose={onClose}
                title={'Adding items to the playbook'}
                setOpen={() => null}
                submitRemediation={() => null}
                setState={() => null}
                state={{
                    formValues: remediationWizardTestData.formValues,
                    percent: 100,
                    failed: false
                }}
            />
        );
        wrapper.update();
        expect(wrapper.find(Progress)).toHaveLength(1);
        expect(wrapper.find(ProgressBar)).toHaveLength(1);
        expect(wrapper.find('.pf-c-progress__description').text()).toEqual('Completed');

        wrapper.find('button[data-ouia-component-id="OpenPlaybookButton"]').simulate('click');
        expect(onClose).toHaveBeenCalledTimes(1);

        wrapper.find('button[data-ouia-component-id="ReturnToAppButton"]').simulate('click');
        expect(onClose).toHaveBeenCalledTimes(2);
    });

    it('should render error progress correctly ', async () => {
        const onClose = jest.fn();
        const setState = jest.fn();
        let wrapper = mount(
            <Progress
                onClose={onClose}
                title={'Adding items to the playbook'}
                setOpen={() => null}
                submitRemediation={() => null}
                setState={setState}
                state={{
                    formValues: remediationWizardTestData.formValues,
                    percent: 10,
                    failed: true
                }}
            />
        );
        expect(wrapper.find(Progress)).toHaveLength(1);
        expect(wrapper.find(ProgressBar)).toHaveLength(1);
        expect(wrapper.find('.pf-c-progress__description').text()).toEqual('Error');

        wrapper.find('button[data-ouia-component-id="BackToWizardButton"]').simulate('click');
        expect(onClose).toHaveBeenCalledTimes(1);
        expect(setState).toHaveBeenCalledTimes(0);

        wrapper.find('button[data-ouia-component-id="TryAgainButton"]').simulate('click');
        expect(setState).toHaveBeenCalledTimes(1);
        expect(onClose).toHaveBeenCalledTimes(1);
    });
});
