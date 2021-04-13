/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { getAdvisorData, getComplianceData, getPatchData, getVulnData } from '../../redux/actions';
import { Title, Level, LevelItem,  Stack, StackItem } from '@patternfly/react-core';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components/Skeleton';
import BugIcon from '@patternfly/react-icons/dist/js/icons/bug-icon';
import EnhancementIcon from '@patternfly/react-icons/dist/js/icons/enhancement-icon';
import SecurityIcon from '@patternfly/react-icons/dist/js/icons/security-icon';

const SystemIssues = ({ isOpened }) => {
    const dispatch = useDispatch();
    const systemId = useSelector(({ entityDetails: { entity } }) => entity?.id);
    const advisor = useSelector(({ entityDetails: { systemIssues } }) => systemIssues?.advisor);
    const compliance = useSelector(({ entityDetails: { systemIssues } }) => systemIssues?.compliance);
    const cve = useSelector(({ entityDetails: { systemIssues } }) => systemIssues?.cve);
    const patch = useSelector(({ entityDetails: { systemIssues } }) => systemIssues?.patch);
    useEffect(() => {
        if (systemId && isOpened) {
            dispatch(getAdvisorData(systemId));
            dispatch(getComplianceData(systemId));
            dispatch(getPatchData(systemId));
            dispatch(getVulnData(systemId));
        }
    }, [ systemId, isOpened ]);

    return <Stack hasGutter className="ins-c-inventory__drawer-system-issues">
        <StackItem>
            <Title headingLevel="h4" size='lg'>Top system issues</Title>
        </StackItem>
        <StackItem>
            <Level>
                <LevelItem>
                    <Stack hasGutter>
                        <StackItem className="ins-c-inventory__drawer--title">
                            Applicable CVEs
                        </StackItem>
                        <StackItem>
                            {
                                cve?.isLoaded ?
                                    <Level hasGutter className="ins-c-inventory__drawer-cve">
                                        <LevelItem className="ins-m-critical">
                                            <a href={`/insights/vulnerability/systems/${systemId}?impact=7`}>
                                                {cve?.critical?.count || 0} critical
                                            </a>
                                        </LevelItem>
                                        <LevelItem className="ins-m-important">
                                            <a href={`/insights/vulnerability/systems/${systemId}?impact=5`}>
                                                {cve?.important?.count || 0} important
                                            </a>
                                        </LevelItem>
                                        <LevelItem className="ins-m-moderate">
                                            <a href={`/insights/vulnerability/systems/${systemId}?impact=4`}>
                                                {cve?.moderate?.count || 0} moderate
                                            </a>
                                        </LevelItem>
                                        <LevelItem className="ins-m-low">
                                            <a href={`/insights/vulnerability/systems/${systemId}?impact=2`}>
                                                {cve?.low?.count || 0} low
                                            </a>
                                        </LevelItem>
                                    </Level> :
                                    <Skeleton size={ SkeletonSize.md } />
                            }
                        </StackItem>
                    </Stack>
                </LevelItem>
                <LevelItem>
                    <Stack hasGutter>
                        <StackItem className="ins-c-inventory__drawer--title">
                            Applicable advisories
                        </StackItem>
                        <StackItem>
                            {
                                patch?.isLoaded ?
                                    <Level hasGutter className="ins-c-inventory__drawer-patch">
                                        <LevelItem>
                                            <a href={`/insights/patch/systems/${systemId}/?advisory_type=2`}>
                                                <BugIcon /> {patch?.bug?.count}
                                            </a>
                                        </LevelItem>
                                        <LevelItem className="ins-m-moderate">
                                            <a href={`/insights/patch/systems/${systemId}/?advisory_type=3`}>
                                                <SecurityIcon /> {patch?.security?.count}
                                            </a>
                                        </LevelItem>
                                        <LevelItem>
                                            <a href={`/insights/patch/systems/${systemId}/?advisory_type=1`}>
                                                <EnhancementIcon /> {patch?.enhancement?.count}
                                            </a>
                                        </LevelItem>
                                    </Level> :
                                    <Skeleton size={ SkeletonSize.md } />
                            }
                        </StackItem>
                    </Stack>
                </LevelItem>
            </Level>
        </StackItem>
        <StackItem>
            {
                advisor?.isLoaded ?
                    <span>
                        <span className="ins-m-critical">
                            {advisor?.criticalCount?.length || 0} critical
                        </span> recommendations in <a href={`./insights/advisor/systems/${systemId}`}>Advisor</a>
                    </span> :
                    <Skeleton size={ SkeletonSize.md } />
            }
        </StackItem>
        {
            compliance?.isLoaded ?
                (compliance?.profiles &&
                    <span>
                        System above compliance threshold for <a
                            href={'./insights/compliance/reports/'}
                        >
                            {compliance?.profiles?.length} {compliance?.profiles?.length > 1 ? 'policies' : 'policy'}
                        </a>
                    </span>
                ) :
                <Skeleton size={ SkeletonSize.md } />
        }
    </Stack>;
};

SystemIssues.propTypes = {
    isOpened: PropTypes.bool
};

export default SystemIssues;
