import React from 'react';
import { CheckCircleIcon, ExclamationCircleIcon } from '@patternfly/react-icons';
import Truncate from 'react-truncate';
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
    constructor(policy) {
        super(policy);
        this.state = { refIdTruncated: <Truncate lines={ 1 }>{ policy.policy.ref_id }</Truncate>, ...policy };
    }

    complianceIcon = () => {
        return this.state.policy.compliant ?
            <div className='ins-c-policy-card ins-m-compliant'>
                <CheckCircleIcon /> Compliant
            </div> :
            <div className='ins-c-policy-card ins-m-noncompliant'>
                <ExclamationCircleIcon/> Noncompliant
            </div>;
    }

    onMouseover = () => {
        this.setState({ refIdTruncated: this.state.policy.ref_id });
    }

    onMouseout = () => {
        this.setState({ refIdTruncated: <Truncate lines={ 1 }>{ this.state.policy.ref_id }</Truncate> });
    }

    render() {
        return (
            <Card>
                <CardBody>
                    <TextContent>
                        <Text style={ { marginBottom: '0' } } component={ TextVariants.small }>External Policy</Text>
                        <Text style={ { marginTop: '0' } } component={ TextVariants.h4 }>{ name }</Text>
                    </TextContent>
                    { this.complianceIcon(this.state.policy.compliant) }
                    <Text component={ TextVariants.small }>
                        { this.state.policy.rules_passed } of { this.state.policy.rules_passed + this.state.policy.rules_failed } rules passed
                    </Text>
                    <Text
                        component={ TextVariants.medium }
                        onMouseEnter={ this.onMouseover.bind(this) }
                        onMouseLeave={ this.onMouseout.bind(this) }
                        style={ { wordWrap: 'break-word' } }
                    >
                        Profile <br/>
                        { this.state.refIdTruncated }
                    </Text>
                </CardBody>
                <CardFooter>
                    <TextContent>
                        <Text component={ TextVariants.small }>
                          Last scanned: { this.state.policy.last_scanned }
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
