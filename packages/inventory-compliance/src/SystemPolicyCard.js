import React from 'react';
import { FormattedRelative } from 'react-intl';
import { CheckCircleIcon, ExclamationCircleIcon } from '@patternfly/react-icons';
import Truncate from 'react-truncate';
import {
    Card,
    CardBody,
    Text,
    TextContent,
    TextVariants
} from '@patternfly/react-core';
import PropTypes from 'prop-types';

class SystemPolicyCard extends React.Component {
    constructor(policy) {
        super(policy);
        this.state = { refIdTruncated: <Truncate lines={ 1 }>{ policy.policy.refId }</Truncate>, ...policy };
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
        this.setState({ refIdTruncated: this.state.policy.refId });
    }

    onMouseout = () => {
        this.setState({ refIdTruncated: <Truncate lines={ 1 }>{ this.state.policy.refId }</Truncate> });
    }

    render() {
        return (
            <Card>
                <CardBody>
                    <TextContent className='margin-bottom-md'>
                        <Text className='margin-bottom-none' component={ TextVariants.small }>External policy</Text>
                        <Text className='margin-bottom-top-none' component={ TextVariants.h4 }>{ this.state.policy.name }</Text>
                    </TextContent>
                    <div className='margin-bottom-md' >
                        { this.complianceIcon(this.state.policy.compliant) }
                        <Text component={ TextVariants.small }>
                            { this.state.policy.rulesPassed } of { this.state.policy.rulesPassed + this.state.policy.rulesFailed } rules passed
                        </Text>
                    </div>
                    <div className='margin-bottom-md' >
                        <Text
                            component={ TextVariants.medium }
                            onMouseEnter={ this.onMouseover }
                            onMouseLeave={ this.onMouseout }
                            className='wrap-break-word'
                        >
                            Profile <br/>
                            { this.state.refIdTruncated }
                        </Text>
                    </div>
                    <Text className='margin-bottom-none' component={ TextVariants.small }>
                      Last scanned: <FormattedRelative value={ Date.parse(this.state.policy.lastScanned) } />
                    </Text>
                </CardBody>
            </Card>
            /* eslint-disable camelcase */
        );
    };
};

SystemPolicyCard.propTypes = {
    policy: PropTypes.shape({
        rulesPassed: PropTypes.number,
        rulesFailed: PropTypes.number,
        lastScanned: PropTypes.string,
        refId: PropTypes.string,
        name: PropTypes.string,
        compliant: PropTypes.bool
    })
};

export default SystemPolicyCard;
