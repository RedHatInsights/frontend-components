import React from 'react';
import mount from '../../__mocks__/mount';
import { TextContent, Text } from '@patternfly/react-core';

import * as TowerCatalog from '../../../addSourceWizard/hardcodedComponents/tower/catalog';

describe('Tower Catalog', () => {
    it('Auth description', () => {
        const wrapper = mount(<TowerCatalog.AuthDescription />);

        expect(wrapper.find(TextContent)).toHaveLength(1);
        expect(wrapper.find(Text)).toHaveLength(2);
    });

    it('Endpoint description', () => {
        const wrapper = mount(<TowerCatalog.EndpointDescription />);

        expect(wrapper.find(TextContent)).toHaveLength(1);
        expect(wrapper.find(Text)).toHaveLength(1);
    });
});
