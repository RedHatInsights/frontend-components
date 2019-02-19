import React from 'react';
import { CheckCircleIcon, ExclamationCircleIcon } from '@patternfly/react-icons';
import {
    Card,
    CardBody,
    CardFooter,
    Text,
    TextContent,
    TextVariants
} from '@patternfly/react-core';
import PropTypes from 'prop-types';

class SystemPolicyCard extends React.Component {
    complianceIcon = () => {
        const { policy: { compliant }} = this.props;

        return compliant ?
            <div className='ins-c-policy-card ins-m-compliant'>
                <CheckCircleIcon /> Compliant
            </div> :
            <div className='ins-c-policy-card ins-m-noncompliant'>
                <ExclamationCircleIcon/> Noncompliant
            </div>;
    }

    render() {
        /* eslint-disable camelcase */
        const { policy: { name, compliant, ref_id, last_scanned, rules_passed, rules_failed }} = this.props;
        return (
            <Card>
                <CardBody>
                    <TextContent>
                        <Text style={ { marginBottom: '0' } } component={ TextVariants.small }>External Policy</Text>
                        <Text style={ { marginTop: '0' } } component={ TextVariants.h4 }>{ name }</Text>
                    </TextContent>
                    { this.complianceIcon(compliant) }
                    <Text component={ TextVariants.small }>
                        { rules_passed } of { rules_passed + rules_failed } rules passed
                    </Text>
                    <Text component={ TextVariants.medium }>
                        Profile <br/>
                        { ref_id }
                    </Text>
                </CardBody>
                <CardFooter>
                    <TextContent>
                        <Text component={ TextVariants.small }>
                          Last scanned: { last_scanned }
                        </Text>
                    </TextContent>
                </CardFooter>
            </Card>
            /* eslint-disable camelcase */
        );
    };
};

SystemPolicyCard.propTypes = {
    policy: PropTypes.shape({
        rules_passed: PropTypes.number,
        rules_failed: PropTypes.number,
        last_scanned: PropTypes.string,
        ref_id: PropTypes.string,
        name: PropTypes.string,
        compliant: PropTypes.bool
    })
};

export default SystemPolicyCard;
