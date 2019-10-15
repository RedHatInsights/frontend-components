import React from 'react';
import { Popover, TextContent, Text, TextVariants, Title } from '@patternfly/react-core';
import { QuestionCircleIcon } from '@patternfly/react-icons';

export const DescriptionSummary = () => (<TextContent>
    <Text component={ TextVariants.p }>
        <Title headingLevel="h3" size="lg">Configure account access&nbsp;
            <Popover
                aria-label="Help text"
                position="bottom"
                bodyContent={
                    <React.Fragment>
                        <Text component={ TextVariants.p }>
            Red Had recommends using the Power User AWS
                                Identity and Access Management (IAM) policy when adding an
                                AWS account as a source. This Policy allows the user full
                                access to API functionality and AWS services for user
                                administration.
                            <br />
            Create an access key in the
            &nbsp;<b>
                Security Credentials
                            </b>&nbsp;
            area of your AWS user account. To add your
                                account as a source, enter the access key ID and secret
                                access key to act as your user ID and password.
                        </Text>
                    </React.Fragment>
                }
                footerContent={ <a href='http://foo.bar'>
    Learn more
                </a> }
            >
                <QuestionCircleIcon />
            </Popover>
        </Title>
    </Text>
    <Text component={ TextVariants.p }>
Create an access key in your AWS user account and enter the details below.
    </Text>
    <Text component={ TextVariants.p }>
For sufficient access and security, Red Hat recommends using
    the Power User IAM polocy for your AWS user account.
    </Text>
    <Text component={ TextVariants.p }>
All fields are required.
    </Text>
</TextContent>);
