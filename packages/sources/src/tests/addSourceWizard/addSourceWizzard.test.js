import React from 'react';
import { act } from 'react-dom/test-utils';

import { AddSourceWizard } from '../../addSourceWizard/index';
import Form from '../../addSourceWizard/SourceAddModal';
import Modal from '../../addSourceWizard/SourceAddModal';
import FinalWizard from '../../addSourceWizard/FinalWizard';
import FinishedStep from '../../addSourceWizard/steps/FinishedStep';
import ErroredStep from '../../addSourceWizard/steps/ErroredStep';

import sourceTypes from '../helpers/sourceTypes';
import applicationTypes from '../helpers/applicationTypes';
import * as dependency from '../../api/index';
import * as createSource from '../../api/createSource';
import CloseModal from '../../addSourceWizard/CloseModal';
import LoadingStep from '../../addSourceWizard/steps/LoadingStep';

import mount from '../__mocks__/mount';
import SourcesFormRenderer from '../../sourceFormRenderer';
import { CLOUD_VENDOR, REDHAT_VENDOR } from '../../utilities/stringConstants';

describe('AddSourceWizard', () => {
    let initialProps;
    let wrapper;
    let SOURCE_DATA_OUT;

    beforeEach(() => {
        initialProps = {
            isOpen: true,
            sourceTypes,
            applicationTypes,
            onClose: jest.fn()
        };

        SOURCE_DATA_OUT = {
            id: '1234',
            applications: []
        };
    });

    it('renders correctly with sourceTypes', async () => {
        await act(async() => {
            wrapper = mount(<AddSourceWizard { ...initialProps } />);
        });
        wrapper.update();

        expect(wrapper.find(Form)).toHaveLength(1);
        expect(wrapper.find(Modal)).toHaveLength(1);

        expect(wrapper.find(SourcesFormRenderer).props().schema.fields[0].fields[1].title).toEqual('Select source type');
    });

    it('renders correctly without sourceTypes', async () => {
        dependency.doLoadSourceTypes = jest.fn(() => new Promise((resolve) => resolve({ sourceTypes })));

        await act(async() => {
            wrapper = mount(<AddSourceWizard { ...initialProps } sourceTypes={undefined}/>);
        });
        wrapper.update();

        expect(wrapper.find(Form)).toHaveLength(1);
        expect(wrapper.find(Modal)).toHaveLength(1);
        expect(dependency.doLoadSourceTypes).toHaveBeenCalled();
    });

    it('show finished step after filling the form', async () => {
        jest.useFakeTimers();
        expect.assertions(8);

        createSource.doCreateSource = jest.fn(() => new Promise((resolve) => setTimeout(() => resolve(SOURCE_DATA_OUT), 100)));
        dependency.findSource = jest.fn(() => Promise.resolve({ data: { sources: [] } }));

        await act(async() => {
            wrapper = mount(<AddSourceWizard { ...initialProps } />);
        });
        wrapper.update();

        await act(async() => {
            wrapper.find('input').instance().value = 'somename';
            wrapper.find('input').simulate('change');
        });
        wrapper.update();

        await act(async () => {
            jest.advanceTimersByTime(1000);
        });
        wrapper.update();

        await act(async() => {
            wrapper.find('form').simulate('submit');
        });
        wrapper.update();

        expect(wrapper.find(FinalWizard)).toHaveLength(1);
        expect(wrapper.find(LoadingStep)).toHaveLength(1);
        expect(wrapper.find(ErroredStep)).toHaveLength(0);
        expect(wrapper.find(FinishedStep)).toHaveLength(0);

        await act(async () => {
            jest.advanceTimersByTime(100);
        });
        wrapper.update();

        expect(wrapper.find(FinalWizard)).toHaveLength(1);
        expect(wrapper.find(LoadingStep)).toHaveLength(0);
        expect(wrapper.find(ErroredStep)).toHaveLength(0);
        expect(wrapper.find(FinishedStep)).toHaveLength(1);

        jest.useRealTimers();
    });

    it('pass created source to afterSuccess function', async () => {
        jest.useFakeTimers();

        const afterSubmitMock = jest.fn();
        createSource.doCreateSource = jest.fn(() => new Promise((resolve) => resolve({ name: 'source', applications: [] })));
        dependency.findSource = jest.fn(() => Promise.resolve({ data: { sources: [] } }));

        await act(async() => {
            wrapper = mount(<AddSourceWizard { ...initialProps } afterSuccess={ afterSubmitMock } />);
        });
        wrapper.update();

        await act(async () => {
            wrapper.find('input').instance().value = 'somename';
            wrapper.find('input').simulate('change');
        });
        wrapper.update();

        await act(async () => {
            jest.advanceTimersByTime(1000);
        });
        wrapper.update();

        await act(async() => {
            wrapper.find('form').simulate('submit');
        });
        wrapper.update();

        await act(async () => {
            jest.runAllTimers();
        });
        wrapper.update();

        expect(afterSubmitMock).toHaveBeenCalledWith({ name: 'source', applications: [] });

        jest.useRealTimers();
    });

    it('pass created source to submitCallback function when success', async () => {
        jest.useFakeTimers();

        const submitCallback = jest.fn();
        createSource.doCreateSource = jest.fn(() => new Promise((resolve) => resolve({ name: 'source', applications: [] })));
        dependency.findSource = jest.fn(() => Promise.resolve({ data: { sources: [] } }));

        await act(async() => {
            wrapper = mount(<AddSourceWizard { ...initialProps } submitCallback={ submitCallback } />);
        });
        wrapper.update();

        await act(async () => {
            wrapper.find('input').instance().value = 'somename';
            wrapper.find('input').simulate('change');
        });
        wrapper.update();

        await act(async () => {
            jest.advanceTimersByTime(1000);
        });
        wrapper.update();

        await act(async() => {
            wrapper.find('form').simulate('submit');
        });
        wrapper.update();

        await act(async () => {
            jest.runAllTimers();
        });
        wrapper.update();

        expect(submitCallback).toHaveBeenCalledWith({
            createdSource: { name: 'source', applications: [] },
            isSubmitted: true,
            sourceTypes
        });

        jest.useRealTimers();
    });

    it('pass values to submitCallback function when errors', async () => {
        jest.useFakeTimers();

        const submitCallback = jest.fn();
        createSource.doCreateSource = jest.fn(() => new Promise((_, reject) => reject('Error - wrong name')));
        dependency.findSource = jest.fn(() => Promise.resolve({ data: { sources: [] } }));

        await act(async() => {
            wrapper = mount(<AddSourceWizard { ...initialProps } submitCallback={ submitCallback } />);
        });
        wrapper.update();

        await act(async () => {
            wrapper.find('input').instance().value = 'somename';
            wrapper.find('input').simulate('change');
        });
        wrapper.update();

        await act(async () => {
            jest.advanceTimersByTime(1000);
        });
        wrapper.update();

        await act(async() => {
            wrapper.find('form').simulate('submit');
        });
        wrapper.update();

        await act(async () => {
            jest.runAllTimers();
        });
        wrapper.update();

        expect(submitCallback).toHaveBeenCalledWith({
            values: { source: { name: 'somename' } },
            isErrored: true,
            sourceTypes,
            error: 'Error - wrong name',
            // because we are using form.submit in test instead of the button,
            // the state is not included
            wizardState: expect.any(Function)
        });

        jest.useRealTimers();
    });

    it('pass values to onClose function', async () => {
        jest.useFakeTimers();

        const CANCEL_BUTTON_INDEX = 3;
        const NAME = 'name';
        const onClose = jest.fn();
        dependency.findSource = jest.fn(() => Promise.resolve({ data: { sources: [] } }));

        await act(async() => {
            wrapper = mount(<AddSourceWizard { ...initialProps } onClose={ onClose } />);
        });
        wrapper.update();

        await act(async () => {
            wrapper.find('input').instance().value = NAME;
            wrapper.find('input').simulate('change');
        });
        wrapper.update();

        await act(async () => {
            jest.advanceTimersByTime(1000);
        });
        wrapper.update();

        await act(async () => {
            wrapper.find('Button').at(CANCEL_BUTTON_INDEX).simulate('click');
        });

        wrapper.update();

        expect(wrapper.find(CloseModal).props().isOpen).toEqual(true);

        await act(async () => {
            wrapper.find('button#on-exit-button').simulate('click');
        });

        wrapper.update();

        expect(onClose).toHaveBeenCalledWith({ source: { name: NAME } });

        jest.useRealTimers();
    });

    it('stay on the wizard', async () => {
        jest.useFakeTimers();

        const CANCEL_BUTTON_INDEX = 3;
        const NAME = 'name';
        const onClose = jest.fn();
        dependency.findSource = jest.fn(() => Promise.resolve({ data: { sources: [] } }));

        await act(async() => {
            wrapper = mount(<AddSourceWizard { ...initialProps } onClose={ onClose } />);
        });
        wrapper.update();

        await act(async () => {
            wrapper.find('input').instance().value = NAME;
            wrapper.find('input').simulate('change');
        });
        wrapper.update();

        await act(async () => {
            jest.advanceTimersByTime(1000);
        });
        wrapper.update();

        await act(async () => {
            wrapper.find('Button').at(CANCEL_BUTTON_INDEX).simulate('click');
        });
        wrapper.update();

        expect(wrapper.find(CloseModal).props().isOpen).toEqual(true);

        await act(async () => {
            wrapper.find('button#on-stay-button').simulate('click');
        });
        wrapper.update();

        expect(wrapper.find(CloseModal).props().isOpen).toEqual(false);

        expect(onClose).not.toHaveBeenCalled();
        expect(wrapper.find('input').instance().value).toEqual(NAME);

        jest.useRealTimers();
    });

    it('show error step after failing the form', async () => {
        jest.useFakeTimers();

        dependency.findSource = jest.fn(() => Promise.resolve({ data: { sources: [] } }));
        const ERROR_MESSAGE = 'fail';
        createSource.doCreateSource = jest.fn(() => new Promise((_resolve, reject) => reject(ERROR_MESSAGE)));

        await act(async() => {
            wrapper = mount(<AddSourceWizard { ...initialProps } />);
        });
        wrapper.update();

        await act(async () => {
            wrapper.find('input').instance().value = 'somename';
            wrapper.find('input').simulate('change');
        });
        wrapper.update();

        await act(async () => {
            jest.advanceTimersByTime(1000);
        });
        wrapper.update();

        await act(async() => {
            wrapper.find('form').simulate('submit');
        });
        wrapper.update();

        expect(wrapper.find(FinalWizard)).toHaveLength(1);
        expect(wrapper.find(FinishedStep)).toHaveLength(0);
        expect(wrapper.find(ErroredStep)).toHaveLength(1);

        jest.useRealTimers();
    });

    describe('different variants', () => {
        let tmpLocation;

        const getNavigation = wrapper => wrapper.find('.pf-c-wizard__nav-item').map(item => item.text());

        beforeEach(() => {
            tmpLocation = Object.assign({}, window.location);

            delete window.location;

            window.location = {};
        });

        afterEach(() => {
            window.location = tmpLocation;
        });

        it('show configuration step when selectedType is set - CLOUD', async () => {
            window.location.search = `activeVendor=${CLOUD_VENDOR}`;

            await act(async() => {
                wrapper = mount(<AddSourceWizard
                    { ...initialProps }
                    selectedType="amazon"
                />);
            });
            wrapper.update();

            expect(getNavigation(wrapper)).toEqual([
                'Name source',
                'Select configuration'
            ]);
        });

        it('show source type selection when CLOUD', async () => {
            window.location.search = `activeVendor=${CLOUD_VENDOR}`;

            await act(async() => {
                wrapper = mount(<AddSourceWizard { ...initialProps } initialValues={{ source_type: 'amazon' }}/>);
            });
            wrapper.update();

            expect(getNavigation(wrapper)).toEqual([
                'Name source',
                'Select source type',
                'Select configuration'
            ]);
        });

        it('show application step when selectedType is set and configuration is selected to true', async () => {
            window.location.search = `activeVendor=${CLOUD_VENDOR}`;

            await act(async() => {
                wrapper = mount(<AddSourceWizard
                    { ...initialProps }
                    selectedType="amazon"
                    initialValues={{ source: { is_super_key: 'true' } }}
                />);
            });
            wrapper.update();

            expect(getNavigation(wrapper)).toEqual([
                'Name source',
                'Select configuration',
                'Select applications',
                'Review details'
            ]);
        });

        it('show application step when selectedType is set and configuration is selected to false', async () => {
            window.location.search = `activeVendor=${CLOUD_VENDOR}`;

            await act(async() => {
                wrapper = mount(<AddSourceWizard
                    { ...initialProps }
                    selectedType="amazon"
                    initialValues={{ source: { is_super_key: 'false' } }}
                />);
            });
            wrapper.update();

            expect(getNavigation(wrapper)).toEqual([
                'Name source',
                'Select configuration',
                'Select application',
                'Credentials'
            ]);
        });

        it('show application step when selectedType is set - RED HAT', async () => {
            window.location.search = `activeVendor=${REDHAT_VENDOR}`;

            await act(async() => {
                wrapper = mount(<AddSourceWizard
                    { ...initialProps }
                    selectedType="openshift"
                />);
            });
            wrapper.update();

            expect(getNavigation(wrapper)).toEqual([
                'Name source',
                'Select application',
                'Credentials',
                'Configure OpenShift endpoint',
                'Review details'
            ]);
        });

        it('show source type selection when REDHAT', async () => {
            window.location.search = `activeVendor=${REDHAT_VENDOR}`;

            await act(async() => {
                wrapper = mount(<AddSourceWizard { ...initialProps }/>);
            });
            wrapper.update();

            expect(getNavigation(wrapper)).toEqual([
                'Name source',
                'Source type and application'
            ]);
        });
    });

    it('pass initialWizardState to wizard', async () => {
        await act(async() => {
            wrapper = mount(<AddSourceWizard { ...initialProps } initialWizardState={{ some: 'state' }} />);
        });
        wrapper.update();

        expect(wrapper.find(SourcesFormRenderer).props().schema.fields[0].initialState).toEqual({ some: 'state' });
    });
});
