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
    constructor(props) {
        super(props);
        this.state = {
            cardTitle: <Truncate lines={ 1 }>{ props.policy.name }</Truncate>,
            cardSubTitle: <Truncate lines={ 1 }>{ props.policy.policyType }</Truncate>,
            refIdTruncated: <Truncate lines={ 1 }>{ props.policy.refId }</Truncate>,
            ...props
        };
    }

    complianceIcon = () => {
        return this.state.policy.compliant ?
            <div className='ins-c-policy-card ins-m-compliant'>
                <CheckCircleIcon /> Compliant
            </div> :
            <div className='ins-c-policy-card ins-m-noncompliant'>
                <ExclamationCircleIcon/> Not compliant
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

    onSubTitleMouseover = () => {
        this.setState({ cardSubTitle: this.state.policy.policyType });
    }

    onSubTitleMouseout = () => {
        this.setState({ cardSubTitle: <Truncate lines={ 1 }>{ this.state.policy.policyType }</Truncate> });
    }

    render() {
        const { policy, benchmark, rulesFailed, compliant, lastScanned, score } = this.state.policy;
        const { refIdTruncated, cardTitle, cardSubTitle } = this.state;
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
                        { policy ?
                            <Text
                                style={{ color: 'var(--pf-global--Color--200)' }}
                                component={ TextVariants.small }
                                onMouseEnter={ this.onSubTitleMouseover }
                                onMouseLeave={ this.onSubTitleMouseout }>
                                { cardSubTitle }
                            </Text>
                            :
                            <Tooltip position='bottom' content={
                                <TextContent>
                                    This policy report was uploaded into the Compliance application.
                                    If you would like to manage your policy inside the Compliance application,
                                    use the &quot;Create a policy&quot; wizard to create one and associate systems.
                                </TextContent>
                            }>
                                External policy <OutlinedQuestionCircleIcon className='grey-icon'/>
                            </Tooltip>
                        }
                    </TextContent>
                    <div className='margin-bottom-md' >
                        { this.complianceIcon(compliant) }
                        <Text component={ TextVariants.small }>
                            { rulesFailed } rule{ rulesFailed === 1 ? '' : 's' } failed
                            {' '}
                            <Tooltip
                                position='bottom'
                                maxWidth='22em'
                                content={
                                    'The system compliance score is calculated by OpenSCAP and ' +
                                    'is a normalized weighted sum of rules selected for this policy.'
                                }>
                                <span>(Score: { passedPercentage })</span>
                            </Tooltip>
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
        policyType: PropTypes.string,
        compliant: PropTypes.bool
    })
};

export default SystemPolicyCard;
