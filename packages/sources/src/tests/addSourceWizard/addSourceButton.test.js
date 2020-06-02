import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

import { AddSourceButton } from '../../addSourceWizard/';
import sourceTypes from '../helpers/sourceTypes';
import applicationTypes from '../helpers/applicationTypes';
import Form from '../../addSourceWizard/SourceAddModal';

describe('AddSourceButton', () => {
    it('opens wizard', async () => {
        let wrapper;

        await act(async() => {
            wrapper = mount(<AddSourceButton  sourceTypes={ sourceTypes } applicationTypes={ applicationTypes }/>);
        });
        wrapper.update();

        await act(async() => {
            wrapper.find('button').simulate('click');
        });

        wrapper.update();

        expect(wrapper.find(Form).length).toBe(1);
    });
});
