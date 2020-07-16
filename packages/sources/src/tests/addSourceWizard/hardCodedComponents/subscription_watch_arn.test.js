import React from 'react';
import { act } from 'react-dom/test-utils';
import mount from '../../__mocks__/mount';
import {
    TextContent,
    Text,
    TextList,
    TextListItem,
    ClipboardCopy
} from '@patternfly/react-core';

import * as SubsAwsArn from '../../../addSourceWizard/hardcodedComponents/aws/subscriptionWatch';
import * as api from '../../../api/subscriptionWatch';

describe('AWS-ARN hardcoded schemas', () => {
    it('ARN DESCRIPTION is rendered correctly', () => {
        const wrapper = mount(<SubsAwsArn.ArnDescription />);

        expect(wrapper.find(TextContent)).toHaveLength(1);
        expect(wrapper.find(Text)).toHaveLength(1);
        expect(wrapper.find(TextList)).toHaveLength(1);
        expect(wrapper.find(TextListItem)).toHaveLength(2);
    });

    it('IAM POLICY is rendered correctly', async () => {
        const CONFIG = { some: 'fake', config: 'oh yeah' };
        api.getSubWatchConfig = jest.fn().mockImplementation(() => Promise.resolve(CONFIG));

        let wrapper;
        await act(async () => {
            wrapper = mount(<SubsAwsArn.IAMPolicyDescription />);
        });
        expect(wrapper.find('input').props().value).toEqual('Loading configuration...');

        wrapper.update();

        expect(wrapper.find(TextContent)).toHaveLength(1);
        expect(wrapper.find(Text)).toHaveLength(2);
        expect(wrapper.find(TextList)).toHaveLength(1);
        expect(wrapper.find(TextListItem)).toHaveLength(3);
        expect(wrapper.find(ClipboardCopy)).toHaveLength(1);

        expect(wrapper.find('input').props().value).toEqual(JSON.stringify(CONFIG, null, 2));
    });

    it('IAM POLICY is rendered correctly with error', async () => {
        const _cons = console.error;
        console.error = jest.fn();

        const ERROR = 'Something went wrong';
        api.getSubWatchConfig = jest.fn().mockImplementation(() => Promise.reject(ERROR));

        let wrapper;
        await act(async () => {
            wrapper = mount(<SubsAwsArn.IAMPolicyDescription />);
        });
        expect(wrapper.find('input').props().value).toEqual('Loading configuration...');

        wrapper.update();

        expect(console.error).toHaveBeenCalledWith(ERROR);
        expect(wrapper.find('input').props().value).toEqual(
            JSON.stringify(
                'There is an error with loading of the configuration. Please go back and return to this step.',
                null,
                2
            )
        );

        console.error = _cons;
    });

    it('IAM ROLE is rendered correctly', () => {
        const CM_ID = '372779871274';
        const wrapper = mount(<SubsAwsArn.IAMRoleDescription />);

        expect(wrapper.find(TextContent)).toHaveLength(1);
        expect(wrapper.find(Text)).toHaveLength(1);
        expect(wrapper.find(TextList)).toHaveLength(1);
        expect(wrapper.find(TextListItem)).toHaveLength(4);
        expect(wrapper.find(ClipboardCopy)).toHaveLength(1);
        expect(wrapper.find(ClipboardCopy).html().includes(CM_ID)).toEqual(true);
    });
});
