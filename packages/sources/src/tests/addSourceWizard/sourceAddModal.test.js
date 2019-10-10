import React from 'react';
import { shallow } from 'enzyme';
import { Wizard } from '@patternfly/react-core';

import AddSourceWizard from '../../addSourceWizard/SourceAddModal';
import sourceTypes from '../helpers/sourceTypes';
import applicationTypes from '../helpers/applicationTypes';
import SourcesFormRenderer from '../../sourceFormRenderer/index';

import * as dependency from '../../api/index';

describe('Steps components', () => {
    let initialProps;
    let spyFunction;

    beforeEach(() => {
        spyFunction = jest.fn();

        initialProps = {
            isOpen: true,
            refreshSources: spyFunction,
            onCancel: jest.fn(),
            onSubmit: jest.fn()
        };
    });

    afterEach(() => {
        spyFunction.mockReset();
    });

    it('renders correctly with sourceTypes and applicationTypes', () => {
        const wrapper = shallow(<AddSourceWizard { ...initialProps } sourceTypes={ sourceTypes } applicationTypes={ applicationTypes }/>);
        expect(wrapper.find(SourcesFormRenderer)).toHaveLength(1);
    });

    it('renders correctly without sourceTypes', (done) => {
        // mock API
        dependency.doLoadApplicationTypes = jest.fn(() => new Promise((resolve) => resolve({ applicationTypes })));
        dependency.doLoadSourceTypes = jest.fn(() => new Promise((resolve) => resolve({ sourceTypes })));

        const wrapper = shallow(<AddSourceWizard { ...initialProps } applicationTypes={ applicationTypes }/>);

        // loading state
        expect(wrapper.find(SourcesFormRenderer)).toHaveLength(0);
        expect(wrapper.find(Wizard)).toHaveLength(1);

        // async call
        setImmediate(() => {
            wrapper.update();
            expect(dependency.doLoadSourceTypes).toHaveBeenCalled();
            expect(dependency.doLoadApplicationTypes).not.toHaveBeenCalled();
            expect(wrapper.find(SourcesFormRenderer)).toHaveLength(1);
            done();
        });
    });

    it('renders correctly without applicationTypes', (done) => {
        // mock API
        dependency.doLoadSourceTypes = jest.fn(() => new Promise((resolve) => resolve({ sourceTypes })));
        dependency.doLoadApplicationTypes = jest.fn(() => new Promise((resolve) => resolve({ applicationTypes })));

        const wrapper = shallow(<AddSourceWizard { ...initialProps } sourceTypes={ sourceTypes }/>);

        // loading state
        expect(wrapper.find(SourcesFormRenderer)).toHaveLength(0);
        expect(wrapper.find(Wizard)).toHaveLength(1);

        // async call
        setImmediate(() => {
            wrapper.update();
            expect(dependency.doLoadSourceTypes).not.toHaveBeenCalled();
            expect(dependency.doLoadApplicationTypes).toHaveBeenCalled();
            expect(wrapper.find(SourcesFormRenderer)).toHaveLength(1);
            done();
        });
    });

    it('renders correctly without sourceTypes and application types', (done) => {
        // mock API
        dependency.doLoadSourceTypes = jest.fn(() => new Promise((resolve) => resolve({ sourceTypes })));
        dependency.doLoadApplicationTypes = jest.fn(() => new Promise((resolve) => resolve({ applicationTypes })));

        const wrapper = shallow(<AddSourceWizard { ...initialProps }/>);

        // loading state
        expect(wrapper.find(SourcesFormRenderer)).toHaveLength(0);
        expect(wrapper.find(Wizard)).toHaveLength(1);

        // async call
        setImmediate(() => {
            wrapper.update();
            expect(dependency.doLoadSourceTypes).toHaveBeenCalled();
            expect(dependency.doLoadApplicationTypes).toHaveBeenCalled();
            expect(wrapper.find(SourcesFormRenderer)).toHaveLength(1);
            done();
        });
    });
});
