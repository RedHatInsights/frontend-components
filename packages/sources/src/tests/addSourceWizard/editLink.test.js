import React from 'react';
import { Button } from '@patternfly/react-core';
import { Link } from 'react-router-dom';

import EditLink from '../../addSourceWizard/EditLink';
import mount from '../__mocks__/mount';

describe('EditLink', () => {
    let id;
    let tmpInsights;

    beforeEach(() => {
        id = 'some-id';
        tmpInsights = insights;
    });

    afterEach(() => {
        insights = tmpInsights;
    });

    it('renders on sources', () => {
        insights = {
            ...insights,
            chrome: {
                ...insights.chrome,
                getApp: () => 'sources'
            }
        };

        const wrapper = mount(<EditLink id={id}/>);

        expect(wrapper.find(Link)).toHaveLength(1);
        expect(wrapper.find(Link).props().to).toEqual('/sources/edit/some-id');
        expect(wrapper.find(Button)).toHaveLength(1);
    });

    it('renders on other app', () => {
        insights = {
            ...insights,
            chrome: {
                ...insights.chrome,
                getApp: () => 'cost-management'
            }
        };

        const wrapper = mount(<EditLink id={id}/>);

        expect(wrapper.find(Link)).toHaveLength(0);
        expect(wrapper.find(Button).props().href).toEqual('/settings/sources/edit/some-id');
        expect(wrapper.find(Button).props().component).toEqual('a');
    });
});
