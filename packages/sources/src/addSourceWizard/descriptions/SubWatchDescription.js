import React from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { Flex, FlexItem, Stack, StackItem, Text } from '@patternfly/react-core';
import { CheckCircleIcon } from '@patternfly/react-icons';

const Point = ({ title, description, ...props }) => (
    <StackItem {...props}>
        <Flex>
            <FlexItem spacer={{ default: 'spacerSm' }}>
                <CheckCircleIcon fill="#3E8635" />
            </FlexItem>
            <FlexItem>
                <Text className="pf-u-mb-xs ins-c-sources__wizard--rhel-desc-title">
                    {title}
                </Text>
                <Text>
                    {description}
                </Text>
            </FlexItem>
        </Flex>
    </StackItem>
);

Point.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
};

const SubWatchDescription = () => {
    const intl = useIntl();

    return (
        <Stack>
            <Point
                title={intl.formatMessage({
                    id: 'rhelbundle.goldImages.title',
                    defaultMessage: 'Red Hat Gold Images'
                })}
                description={intl.formatMessage({
                    id: 'rhelbundle.goldImages.description',
                    defaultMessage: 'Unlock cloud images in AWS and bring your own subscription instead of paying hourly.'
                })}
                className="pf-u-mb-sm"
            />
            <Point
                title={intl.formatMessage({
                    id: 'rhelbundle.subwatch.title',
                    defaultMessage: 'High precision subscription watch data'
                })}
                description={intl.formatMessage({
                    id: 'rhelbundle.subwatch.description',
                    defaultMessage: 'View precise public cloud usage data in subscription watch.'
                })}
                className="pf-u-mb-sm"
            />
            <Point
                title={intl.formatMessage({
                    id: 'rhelbundle.autoregistration.title',
                    defaultMessage: 'Autoregistration'
                })}
                description={intl.formatMessage({
                    id: 'rhelbundle.goldImages.description',
                    defaultMessage: 'Cloud instances automatically connect to cloud.redhat.com when provisioned.'
                })}
            />
        </Stack>
    );
};

export default SubWatchDescription;
