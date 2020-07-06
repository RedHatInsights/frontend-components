import React, { Fragment } from 'react';
import { FormattedRelative, FormattedRelativeTime } from 'react-intl';
import { CheckCircleIcon, ExclamationCircleIcon, OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import Truncate from 'react-truncate';

import {
    Card,
    CardBody,
    Text,
    TextContent,
    TextVariants,
    Tooltip
} from '@patternfly/react-core';
import PropTypes from 'prop-types';

class SystemPolicyCard extends React.Component {
    constructor(policy) {
        super(policy);
        this.state = {
            cardTitle: <Truncate lines={ 1 }>{ policy.policy.name }</Truncate>,
            refIdTruncated: <Truncate lines={ 1 }>{ policy.policy.refId }</Truncate>,
            ...policy
        };
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

    fixedPercentage = (value, fixed = 0, withPercent = true) => (
        (value).toFixed(fixed) + (withPercent ? '%' : '')
    );

    onMouseover = () => {
        this.setState({ refIdTruncated: this.state.policy.refId });
    }

    onMouseout = () => {
        this.setState({ refIdTruncated: <Truncate lines={ 1 }>{ this.state.policy.refId }</Truncate> });
    }

    onTitleMouseover = () => {
        this.setState({ cardTitle: this.state.policy.name });
    }

    onTitleMouseout = () => {
        this.setState({ cardTitle: <Truncate lines={ 1 }>{ this.state.cardTitle }</Truncate> });
    }

    render() {
        const { policy, benchmark, rulesPassed, rulesFailed, compliant, lastScanned, score } = this.state.policy;
        const { refIdTruncated, cardTitle } = this.state;
        const passedPercentage = this.fixedPercentage(score);
        const FormattedRelativeCmp = FormattedRelativeTime || FormattedRelative || Fragment;

        return (
            <Card>
                <CardBody>
                    <TextContent className='margin-bottom-md'>
                        <Text className='margin-bottom-top-none'
                            component={ TextVariants.h4 }
                            onMouseEnter={ this.onTitleMouseover }
                            onMouseLeave={ this.onTitleMouseout }
                        >
                            { cardTitle }
                        </Text>
                        { !policy && <Tooltip position='bottom' content={
                            <span>This policy report was uploaded into the Compliance application.
                            If you would like to manage your policy inside the Compliance application,
                            use the &quot;Create a policy&quot; wizard to create one and associate systems.</span>
                        }>
                            <span>
                                External policy <OutlinedQuestionCircleIcon className='grey-icon'/>
                            </span>
                        </Tooltip> }
                    </TextContent>
                    <div className='margin-bottom-md' >
                        { this.complianceIcon(compliant) }
                        <Text component={ TextVariants.small }>
                            { rulesPassed } of { rulesPassed + rulesFailed } rules passed ({ passedPercentage })
                        </Text>
                    </div>
                    <div className='margin-bottom-md' >
                        <Text
                            component={ TextVariants.medium }
                            onMouseEnter={ this.onMouseover }
                            onMouseLeave={ this.onMouseout }
                            className='wrap-break-word'
                        >
                            Profile: { refIdTruncated }
                            <br/>
                            SSG version: { benchmark.version }
                        </Text>
                    </div>
                    <Text className='margin-bottom-none' component={ TextVariants.small }>
                      Last scanned: <FormattedRelativeCmp value={ Date.parse(lastScanned) } />
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
        score: PropTypes.number,
        lastScanned: PropTypes.string,
        refId: PropTypes.string,
        name: PropTypes.string,
        compliant: PropTypes.bool
    })
};

export default SystemPolicyCard;
