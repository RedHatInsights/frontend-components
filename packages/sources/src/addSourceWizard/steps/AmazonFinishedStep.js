import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import {
    EmptyStateBody,
    EmptyState,
    EmptyStateIcon,
    Title,
    Button,
    EmptyStateSecondaryActions,
    EmptyStateVariant,
    Bullseye,
    Alert,
    Text,
    Grid,
    GridItem
} from '@patternfly/react-core';
import { CheckCircleIcon } from '@patternfly/react-icons';

const AwsLink = ({ href, children }) => (
    <React.Fragment>
        <CheckCircleIcon className="pf-u-mr-sm" fill="var(--pf-global--success-color--100)"/>
        <Text component="a" href={href} target="_blank" rel="noopener noreferrer">
            {children}
        </Text>
    </React.Fragment>
);

AwsLink.propTypes = {
    href: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired
};

const PREFIX = insights.chrome.isBeta() ? 'beta/' : '';

const GOLDIMAGES_HREF = 'https://access.redhat.com/management/cloud';
const SUBWATCH_HREF = `/${PREFIX}subscriptions`;
const INSIGHTS_HREF = `/${PREFIX}insights`;
const COST_HREF = `/${PREFIX}cost-management`;
const LEARNMORE_HREF = 'https://access.redhat.com/public-cloud/aws';

const AmazonFinishedStep = ({
    onClose
}) => {
    const intl = useIntl();

    return (
        <Fragment>
            <Alert
                variant="info"
                isInline
                title={intl.formatMessage({ id: 'aws.alertTitle', defaultMessage: 'Allow 24 hours for full activation' })}
            >
                {intl.formatMessage({
                    id: 'aws.alertDescription',
                    defaultMessage: 'Manage connections for this source at any time in Settings > Sources.'
                })}
            </Alert>
            <Bullseye>
                <EmptyState variant={ EmptyStateVariant.full } className="pf-u-mt-md" >
                    <EmptyStateIcon icon={ CheckCircleIcon } color="var(--pf-global--success-color--100)" className="pf-u-mb-0"/>
                    <Title headingLevel="h2" size="xl" className="pf-u-mt-xl">
                        {intl.formatMessage({ id: 'aws.successTitle', defaultMessage: 'Amazon Web Services connection established' })}
                    </Title>
                    <EmptyStateBody>
                        {intl.formatMessage({ id: 'aws.successDescription', defaultMessage: 'Discover the benefits of your connection or exit to manage your new source.' })}
                        <Grid hasGutter className="ins-c-source__aws-grid pf-u-mt-md">
                            <GridItem md="6">
                                <AwsLink href={GOLDIMAGES_HREF}>
                                    {intl.formatMessage({ id: 'aws.goldImages', defaultMessage: 'View enabled AWS Gold images' })}
                                </AwsLink>
                            </GridItem>
                            <GridItem md="6">
                                <AwsLink href={SUBWATCH_HREF}>
                                    {intl.formatMessage({ id: 'aws.subwtachUsage', defaultMessage: 'Subscription Watch usage' })}
                                </AwsLink>
                            </GridItem>
                            <GridItem md="6">
                                <AwsLink href={INSIGHTS_HREF}>
                                    {intl.formatMessage({ id: 'aws.insights', defaultMessage: 'Get started with Red Hat Insights' })}
                                </AwsLink>
                            </GridItem>
                            <GridItem md="6">
                                <AwsLink href={COST_HREF}>
                                    {intl.formatMessage({ id: 'aws.costLink', defaultMessage: 'Cost Management reporting' })}
                                </AwsLink>
                            </GridItem>
                        </Grid>
                    </EmptyStateBody>
                    <Button variant="primary" onClick={ onClose } className="pf-u-mt-xl">
                        {intl.formatMessage({ id: 'exit', defaultMessage: 'Exit' })}
                    </Button>
                    <EmptyStateSecondaryActions>
                        <Text component="a" href={LEARNMORE_HREF} target="_blank" rel="noopener noreferrer">
                            {intl.formatMessage({ id: 'aws.learnMore', defaultMessage: 'Learn more about this Cloud' })}
                        </Text>
                    </EmptyStateSecondaryActions>
                </EmptyState>
            </Bullseye>
        </Fragment>
    );
};

AmazonFinishedStep.propTypes = {
    onClose: PropTypes.func.isRequired
};

export default AmazonFinishedStep;
