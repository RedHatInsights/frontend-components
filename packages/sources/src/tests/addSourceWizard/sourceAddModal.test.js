import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import AddSourceWizard from '../../addSourceWizard/SourceAddModal';
import sourceTypes from '../helpers/sourceTypes';

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

    it('renders correctly with sourceTypes', () => {
        const wrapper = shallow(<AddSourceWizard { ...initialProps } sourceTypes={ sourceTypes }/>);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders correctly without sourceTypes', (done) => {
        // mock API
        dependency.doLoadSourceTypes = jest.fn(() => new Promise((resolve) => resolve(sourceTypes)));

        const wrapper = shallow(<AddSourceWizard { ...initialProps }/>);

        // loading state
        expect(toJson(wrapper)).toMatchSnapshot();

        // async call
        setImmediate(() => {
            wrapper.update();
            expect(toJson(wrapper)).toMatchSnapshot();
            done();
        });
    });
});
