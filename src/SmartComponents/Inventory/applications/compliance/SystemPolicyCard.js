import React from 'react';
import { CheckCircleIcon, ExclamationCircleIcon } from '@patternfly/react-icons';
import PropTypes from 'prop-types';
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Text,
    TextContent,
    TextVariants
} from '@patternfly/react-core';

/* eslint camelcase: off */

class SystemPolicyCard extends React.Component {
    complianceIcon = (compliant) => {
        if (compliant) {
            return <div style={ { fontSize: 'large', color: '#92d400' } } id='policy_compliant'>
                <CheckCircleIcon /> Compliant
            </div>;
        } else {
            return <div style={ { fontSize: 'large', color: '#a30000' } } id='policy_compliant'>
                <ExclamationCircleIcon/> Noncompliant
            </div>;
        }
    }

    render() {
        const { policy } = this.props;
        return (
            <Card>
                <CardBody>
                    <TextContent>
                        <Text style={ { marginBottom: '0px' } } component={ TextVariants.small }>External Policy</Text>
                        <Text style={ { marginBottom: '0px' } } component={ TextVariants.medium }>{ policy.name }</Text>
                    </TextContent>
                    <TextContent>
                        { this.complianceIcon(policy.compliant) }
                        <Text component={ TextVariants.small }>
                            { policy.rules_passed } of { policy.rules_passed + policy.rules_failed } passed
                        </Text>
                        <Text component={ TextVariants.medium }>
                            Profile <br/>
                            { policy.ref_id }
                        </Text>
                    </TextContent>
                </CardBody>
                <CardFooter>
                    <TextContent>
                        <Text component={ TextVariants.small }>
                          Last scanned: { policy.last_scanned }
                        </Text>
                    </TextContent>
                </CardFooter>
            </Card>
        );
    };
};

SystemPolicyCard.propTypes = {
    policy: PropTypes.shape({
        rules_passed: PropTypes.number,
        rules_failed: PropTypes.number,
        last_scanned: PropTypes.string,
        ref_id: PropTypes.string,
        compliant: PropTypes.bool
    })
};

export default SystemPolicyCard;
