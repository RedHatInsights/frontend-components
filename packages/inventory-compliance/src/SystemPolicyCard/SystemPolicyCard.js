import React from 'react';
import DateFormat from '@redhat-cloud-services/frontend-components/DateFormat';
import { CheckCircleIcon, ExclamationCircleIcon, OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import Truncate from 'react-truncate';

import {
    Card,
    CardBody,
    CardFooter,
    Text,
    TextContent,
    TextVariants,
    Tooltip
} from '@patternfly/react-core';
import PropTypes from 'prop-types';
import { UnsupportedSSGVersion } from '../PresentationalComponents';

class SystemPolicyCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cardTitle: <Truncate lines={ 1 }>{ props.policy.name }</Truncate>,
            cardSubTitle: <Truncate lines={ 1 }>{ props.policy.policyType }</Truncate>,
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
        const {
            policy, rulesFailed, compliant, lastScanned, score, ssgVersion, supported
        } = this.state.policy;
        const { cardTitle, cardSubTitle, style } = this.state;
        const passedPercentage = this.fixedPercentage(score);

        return <Card style={ style }>
            <CardBody>
                <TextContent className='margin-bottom-md'>
                    <Text className='margin-bottom-top-none'
                        component={ TextVariants.h4 }
                        onMouseEnter={ this.onTitleMouseover }
                        onMouseLeave={ this.onTitleMouseout }
                    >
                        { cardTitle }
                    </Text>
                    <Text
                        style={{ color: 'var(--pf-global--Color--200)' }}
                        component={ TextVariants.small }
                        onMouseEnter={ this.onSubTitleMouseover }
                        onMouseLeave={ this.onSubTitleMouseout }>
                        { cardSubTitle }
                    </Text>
                </TextContent>
                <div className='margin-bottom-md' >
                    { supported && this.complianceIcon(compliant) }
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
                <Text className='margin-bottom-none' component={ TextVariants.small }>
                    <Text>
                        SSG version: { ssgVersion }
                    </Text>
                    <Text>
                        Last scanned: { lastScanned !== 'Never' ? <DateFormat date={Date.parse(lastScanned)} type='relative' /> : lastScanned }
                    </Text>
                </Text>
            </CardBody>
            { !supported &&
                <CardFooter style={{ padding: '0' }}>
                    <UnsupportedSSGVersion
                        ssgVersion={ ssgVersion }
                        style={{
                            paddingTop: 'var(--pf-c-alert--PaddingTop)',
                            paddingRight: 'var(--pf-c-card--child--PaddingRight)',
                            paddingLeft: 'var(--pf-c-card--child--PaddingLeft)',
                            paddingBottom: 'var(--pf-c-alert--PaddingBottom)'
                        }}
                    />
                </CardFooter>
            }
        </Card>;
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
        compliant: PropTypes.bool,
        ssgVersion: PropTypes.string,
        supported: PropTypes.bool,
        style: PropTypes.object
    })
};

export default SystemPolicyCard;
