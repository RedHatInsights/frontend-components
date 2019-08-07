import React from 'react';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import { AddSourceButton } from '../../addSourceWizard/';
import sourceTypes from '../helpers/sourceTypes';
import applicationTypes from '../helpers/applicationTypes';
import Form from '../../addSourceWizard/SourceAddModal';

describe('AddSourceButton', () => {

    it('renders correctly', () => {
        const wrapper = shallow(<AddSourceButton />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('opens wizard', () => {
        const wrapper = mount(<AddSourceButton  sourceTypes={ sourceTypes } applicationTypes={ applicationTypes }/>);
        wrapper.find('button').simulate('click');

        wrapper.update();

        expect(wrapper.find(Form).length).toBe(1);
    });
});
