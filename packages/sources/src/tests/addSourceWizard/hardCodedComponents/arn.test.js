import React from 'react';
import { mount } from 'enzyme';
import {
    TextContent,
    Text,
    TextList,
    TextListItem,
    ClipboardCopy
} from '@patternfly/react-core';

import * as AwsArn from '../../../addSourceWizard/hardcodedComponents/aws/arn';

describe('AWS-ARN hardcoded schemas', () => {
    it('ARN DESCRIPTION is rendered correctly', () => {
        const wrapper = mount(<AwsArn.ArnDescription />);

        expect(wrapper.find(TextContent)).toHaveLength(1);
        expect(wrapper.find(Text)).toHaveLength(1);
        expect(wrapper.find(TextList)).toHaveLength(1);
        expect(wrapper.find(TextListItem)).toHaveLength(2);
    });

    it('IAM POLICY is rendered correctly', () => {
        const S3_BUCKET_NAME = 'BBBUCKETTT';
        const FORM_OPTIONS = {
            getState: () => ({
                values: {
                    billing_source: {
                        bucket: S3_BUCKET_NAME
                    }
                }
            })
        };

        const wrapper = mount(<AwsArn.IAMPolicyDescription formOptions={FORM_OPTIONS}/>);

        expect(wrapper.find(TextContent)).toHaveLength(1);
        expect(wrapper.find(Text)).toHaveLength(2);
        expect(wrapper.find(TextList)).toHaveLength(1);
        expect(wrapper.find(TextListItem)).toHaveLength(3);
        expect(wrapper.find(ClipboardCopy)).toHaveLength(1);
        expect(wrapper.find(ClipboardCopy).html().includes(S3_BUCKET_NAME)).toEqual(true);
    });

    it('IAM POLICY returns error message when there is no S3_bucket value', () => {
        const S3_BUCKET_NAME = undefined;
        const FORM_OPTIONS = {
            getState: () => ({
                values: {
                    billing_source: {
                        bucket: S3_BUCKET_NAME
                    }
                }
            })
        };

        const wrapper = mount(<AwsArn.IAMPolicyDescription formOptions={FORM_OPTIONS}/>);

        expect(wrapper.find(Text)).toHaveLength(1);
        expect(wrapper.find(Text).text().includes('wrong')).toEqual(true);
    });

    it('IAM ROLE is rendered correctly', () => {
        const CM_ID = '589173575009';
        const wrapper = mount(<AwsArn.IAMRoleDescription />);

        expect(wrapper.find(TextContent)).toHaveLength(1);
        expect(wrapper.find(Text)).toHaveLength(1);
        expect(wrapper.find(TextList)).toHaveLength(1);
        expect(wrapper.find(TextListItem)).toHaveLength(4);
        expect(wrapper.find(ClipboardCopy)).toHaveLength(1);
        expect(wrapper.find(ClipboardCopy).html().includes(CM_ID)).toEqual(true);
    });

    it('TAGS DESCRIPTION is rendered correctly', () => {
        const wrapper = mount(<AwsArn.TagsDescription />);

        expect(wrapper.find(TextContent)).toHaveLength(1);
        expect(wrapper.find(Text)).toHaveLength(1);
        expect(wrapper.find(TextList)).toHaveLength(1);
        expect(wrapper.find(TextListItem)).toHaveLength(2);
    });

    it('USAGE description is rendered correctly', () => {
        const wrapper = mount(<AwsArn.UsageDescription />);

        expect(wrapper.find(TextContent)).toHaveLength(1);
        expect(wrapper.find(Text)).toHaveLength(1);
        expect(wrapper.find(TextList)).toHaveLength(2);
        expect(wrapper.find(TextListItem)).toHaveLength(8);
    });
});
